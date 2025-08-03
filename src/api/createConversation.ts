import { IConversation } from "@/types";
import { settingsAtom, FIXED_SETTINGS } from "@/store/settings";
import { getDefaultStore } from "jotai";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Get settings from Jotai store
  const settings = getDefaultStore().get(settingsAtom);
  
  // Add debug logs
  console.log('Creating conversation with settings:', settings);
  console.log('Using persona_id:', settings.persona);
  console.log('Using replica_id:', settings.replica);
  
  // Use default IDs if none are provided
  const DEFAULT_PERSONA_ID = "p27be05d9881";
  const DEFAULT_REPLICA_ID = "rb17cf590e15";
  
  // Build the payload according to Tavus API requirements
  const payload: any = {
    conversation_name: "F&I Training Session",
    conversational_context: FIXED_SETTINGS.conversationalContext,
  };

  // Prefer replica_id if both are provided
  if (settings.replica || !settings.persona) {
    payload.replica_id = settings.replica || DEFAULT_REPLICA_ID;
    // If we have a replica but no persona, we might need to add custom settings
    if (!settings.persona) {
      payload.custom_greeting = FIXED_SETTINGS.greeting;
    }
  }
  
  // Add persona_id if provided or use default
  if (settings.persona || !settings.replica) {
    payload.persona_id = settings.persona || DEFAULT_PERSONA_ID;
  }

  // Add language if not English
  if (settings.language && settings.language !== "en") {
    payload.language = settings.language;
  }

  // Remove any undefined fields
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
      delete payload[key];
    }
  });
  
  console.log('Sending payload to API:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('API Response status:', response.status);
    console.log('API Response body:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData._schema) {
          errorMessage = `Configuration Error: ${errorData._schema[0]}`;
        } else {
          errorMessage += `, message: ${errorData.message || errorData.error || responseText}`;
        }
      } catch {
        errorMessage += `, message: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};