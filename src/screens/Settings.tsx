import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
} from "@/components/DialogWrapper";
import { cn } from "@/utils";
import { useAtom } from "jotai";
import { getDefaultStore } from "jotai";
import { settingsAtom, settingsSavedAtom, FIXED_SETTINGS } from "@/store/settings";
import { screenAtom } from "@/store/screens";
import { X, Info } from "lucide-react";
import * as React from "react";
import { apiTokenAtom } from "@/store/tokens";

// Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "outline";
    size?: "icon";
  }
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
        {
          "border border-input bg-transparent hover:bg-accent": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "size-10": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Label Component
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

// Select Component
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

// Info Box Component
const InfoBox = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="bg-black/10 border border-white/20 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Info className="size-5 text-white/70 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="text-xs text-white/70 whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);
  const [, setSettingsSaved] = useAtom(settingsSavedAtom);

  const languages = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Italian", value: "it" },
    { label: "Portuguese", value: "pt" },
    { label: "Japanese", value: "ja" },
    { label: "Chinese (Mandarin)", value: "zh" },
  ];

  const interruptSensitivities = [
    { label: "Super Low", value: "superlow" },
    { label: "Very Low", value: "verylow" },
    { label: "Low (Recommended for Training)", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const handleClose = () => {
    setScreenState({ 
      currentScreen: token ? "instructions" : "intro" 
    });
  };

  const handleSave = async () => {
    console.log('Current settings before save:', settings);
    
    // Save only the editable settings
    localStorage.setItem('tavus-fi-training-settings', JSON.stringify(settings));
    
    // Update the store
    const store = getDefaultStore();
    store.set(settingsAtom, settings);
    
    // Wait a moment to ensure the store is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setSettingsSaved(true);
    handleClose();
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="relative w-full max-w-2xl">
          <div className="sticky top-0 pt-8 pb-6 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute right-0 top-8"
            >
              <X className="size-6" />
            </Button>
            
            <h2 className="text-2xl font-bold text-white">F&I Training Settings</h2>
          </div>
          
          <div className="h-[calc(100vh-500px)] overflow-y-auto pr-4 -mr-4">
            <div className="space-y-6">
              {/* Fixed Settings Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Training Configuration</h3>
                
                <InfoBox 
                  title="Trainer Name" 
                  content={FIXED_SETTINGS.name}
                />
                
                <InfoBox 
                  title="Opening Greeting" 
                  content={`"${FIXED_SETTINGS.greeting}"`}
                />
                
                <div className="bg-black/10 border border-white/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="size-5 text-white/70 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white/90">Training Context</p>
                      <div className="text-xs text-white/70 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-mono" style={{ fontFamily: "'Source Code Pro', monospace" }}>
                          {FIXED_SETTINGS.context}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-white/60 italic">
                  These settings are pre-configured for the F&I training program and cannot be modified.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Customizable Settings</h3>
                
                <div className="space-y-6">
                  {/* Language Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      id="language"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="bg-black/20 font-mono"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    >
                      {languages.map((lang) => (
                        <option 
                          key={lang.value} 
                          value={lang.value}
                          className="bg-black text-white font-mono"
                          style={{ fontFamily: "'Source Code Pro', monospace" }}
                        >
                          {lang.label}
                        </option>
                      ))}
                    </Select>
                    <p className="text-xs text-white/60">
                      Select the language for the training session. The AI will listen and respond in this language.
                    </p>
                  </div>

                  {/* Interrupt Sensitivity */}
                  <div className="space-y-2">
                    <Label htmlFor="interruptSensitivity">Interrupt Sensitivity</Label>
                    <Select
                      id="interruptSensitivity"
                      value={settings.interruptSensitivity}
                      onChange={(e) => setSettings({ ...settings, interruptSensitivity: e.target.value })}
                      className="bg-black/20 font-mono"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    >
                      {interruptSensitivities.map((sensitivity) => (
                        <option 
                          key={sensitivity.value} 
                          value={sensitivity.value}
                          className="bg-black text-white font-mono"
                          style={{ fontFamily: "'Source Code Pro', monospace" }}
                        >
                          {sensitivity.label}
                        </option>
                      ))}
                    </Select>
                    <p className="text-xs text-white/60">
                      Controls how easily the trainee can interrupt the AI trainer. Lower settings allow trainees to complete their presentations.
                    </p>
                  </div>

                  {/* Persona ID */}
                  <div className="space-y-2">
                    <Label htmlFor="persona">Tavus Persona ID</Label>
                    <Input
                      id="persona"
                      value={settings.persona}
                      onChange={(e) => setSettings({ ...settings, persona: e.target.value })}
                      placeholder="p2fbd605"
                      className="bg-black/20 font-mono"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    />
                    <p className="text-xs text-white/60">
                      Enter the Persona ID from your Tavus dashboard for the F&I Trainer.
                    </p>
                  </div>

                  {/* Replica ID */}
                  <div className="space-y-2">
                    <Label htmlFor="replica">Tavus Replica ID</Label>
                    <Input
                      id="replica"
                      value={settings.replica}
                      onChange={(e) => setSettings({ ...settings, replica: e.target.value })}
                      placeholder="rfb51183fe"
                      className="bg-black/20 font-mono"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    />
                    <p className="text-xs text-white/60">
                      Enter the Replica ID from your Tavus dashboard for the John trainer replica.
                    </p>
                  </div>

                  {/* API Token */}
                  <div className="space-y-2">
                    <Label htmlFor="apiToken">API Token</Label>
                    <Input
                      id="apiToken"
                      type="password"
                      value={token || ""}
                      onChange={(e) => {
                        const newToken = e.target.value;
                        setToken(newToken);
                        localStorage.setItem('tavus-token', newToken);
                      }}
                      placeholder="Enter Tavus API Key"
                      className="bg-black/20 font-mono"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    />
                    <p className="text-xs text-white/60">
                      Your Tavus API key for authentication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="bg-black/10 border border-white/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="size-5 text-white/70 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/90">Need help?</p>
                      <p className="text-xs text-white/70">
                        You can find your Persona ID and Replica ID in your{' '}
                        <a 
                          href="https://app.tavus.io" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          Tavus dashboard
                        </a>
                        . Make sure you've created both the F&I Trainer persona and replica before configuring these settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 border-t border-gray-700 pt-6 pb-8">
            <button
              onClick={handleSave}
              className="hover:shadow-footer-btn relative flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.1)] px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:text-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};