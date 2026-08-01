"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations/registration";
import { useState } from "react";
import { submitRegistration } from "../actions/register";

import { ShieldAlert, Code2, Palette, Megaphone, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  { value: "TECHNICAL", label: "Technical", icon: ShieldAlert },
  { value: "WEB_DEVELOPMENT", label: "Web Development", icon: Code2 },
  { value: "DESIGN", label: "Design", icon: Palette },
  { value: "SOCIAL_MEDIA", label: "Social Media", icon: Megaphone },
  { value: "EVENT_MANAGEMENT", label: "Event Management", icon: Users },
];

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "", registrationNumber: "", phoneNumber: "", branch: "", year: "",
      department1: "", department2: "",
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['fullName', 'registrationNumber', 'phoneNumber', 'branch', 'year'];
    if (step === 2) fieldsToValidate = ['department1', 'department2'];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true); setError(null);
    try {
      await submitRegistration(data);
      // Handle success redirect or state here
    } catch (err: any) {
      setError(err.message || "Protocol Failure.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-mono text-cyan-500">
      
      {/* HUD Header */}
      <div className="border border-cyan-500/30 p-4 mb-6 bg-[#060A13]/80 backdrop-blur-md flex justify-between items-center">
        <div>
          <div className="text-[10px] text-cyan-600 mb-1">&gt; INITIALIZING PROTOCOL</div>
          <h2 className="text-xl font-bold tracking-widest text-white">APPLICANT DOSSIER</h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-cyan-600 mb-1">STAGE</div>
          <div className="text-lg font-bold text-cyan-400">0{step}/02</div>
        </div>
      </div>

      <div className="border border-cyan-500/30 bg-[#060A13]/80 backdrop-blur-md p-8 relative cyber-bracket">
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6">
                <div className="text-xs text-green-400 mb-8 border-b border-cyan-500/20 pb-4 tracking-widest uppercase">
                  SECTION 01: IDENTITY CONFIRMATION
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputRow label="FULL NAME" error={form.formState.errors.fullName?.message}>
                    <input {...form.register("fullName")} className="hud-input" placeholder="Enter full name" />
                  </InputRow>
                  
                  <InputRow label="REGISTRATION NUMBER" error={form.formState.errors.registrationNumber?.message}>
                    <input {...form.register("registrationNumber")} className="hud-input uppercase" placeholder="e.g. 23BCE1234" />
                  </InputRow>

                  <InputRow label="PHONE NUMBER" error={form.formState.errors.phoneNumber?.message}>
                    <input {...form.register("phoneNumber")} className="hud-input" placeholder="+91 0000000000" />
                  </InputRow>

                  <InputRow label="BRANCH" error={form.formState.errors.branch?.message}>
                    <input {...form.register("branch")} className="hud-input" placeholder="e.g. CSE Core" />
                  </InputRow>

                  <InputRow label="YEAR" error={form.formState.errors.year?.message}>
                    <select {...form.register("year")} className="hud-input">
                      <option value="">[ SELECT YEAR ]</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                    </select>
                  </InputRow>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-8">
                <div className="text-xs text-green-400 mb-8 border-b border-cyan-500/20 pb-4 tracking-widest uppercase">
                  SECTION 02: BATTLEFIELD ASSIGNMENT
                </div>
                
                <div className="space-y-4">
                  <div className="text-[10px] text-cyan-600">PRIMARY DIRECTIVE</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {DEPARTMENTS.map(dept => (
                      <DeptSelector 
                        key={dept.value} dept={dept} 
                        isSelected={form.watch("department1") === dept.value}
                        isDisabled={form.watch("department2") === dept.value}
                        onClick={() => form.setValue("department1", dept.value, {shouldValidate: true})}
                      />
                    ))}
                  </div>
                  {form.formState.errors.department1 && <p className="text-red-400 text-[10px]">{form.formState.errors.department1.message}</p>}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="text-[10px] text-cyan-600">SECONDARY DIRECTIVE</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {DEPARTMENTS.map(dept => (
                      <DeptSelector 
                        key={dept.value} dept={dept} 
                        isSelected={form.watch("department2") === dept.value}
                        isDisabled={form.watch("department1") === dept.value}
                        onClick={() => form.setValue("department2", form.watch("department2") === dept.value ? "" : dept.value, {shouldValidate: true})}
                      />
                    ))}
                  </div>
                </div>
                
                {error && <div className="text-red-400 text-[10px] uppercase tracking-widest border border-red-500/30 p-2 bg-red-900/10">ERROR: {error}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 pt-6 border-t border-cyan-500/20">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="text-[10px] text-cyan-600 hover:text-cyan-400 uppercase tracking-widest">
                &lt; ABORT CURRENT STAGE
              </button>
            ) : <div></div>}
            
            {step < 2 ? (
              <button type="button" onClick={nextStep} className="border border-cyan-500 bg-cyan-950/30 text-cyan-400 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors cyber-bracket">
                PROCEED TO NEXT STAGE &gt;
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="border border-green-500 bg-green-950/30 text-green-400 px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-black transition-colors cyber-bracket">
                {isSubmitting ? "TRANSMITTING..." : "EXECUTE FINAL SUBMISSION"}
              </button>
            )}
          </div>

        </form>
      </div>

      <style jsx global>{`
        .hud-input {
          @apply w-full bg-transparent border-b border-cyan-500/30 text-cyan-300 py-2 focus:outline-none focus:border-cyan-400 text-xs placeholder:text-cyan-900;
        }
        select.hud-input option {
          @apply bg-[#050B14] text-cyan-500;
        }
      `}</style>
    </div>
  );
}

// Helpers
function InputRow({ label, error, children, vertical }: any) {
  return (
    <div className={`flex ${vertical ? 'flex-col gap-2' : 'flex-col gap-1'}`}>
      <div className="text-[9px] text-cyan-700 tracking-widest uppercase">{label}</div>
      {children}
      {error && <div className="text-[8px] text-red-400 mt-1 uppercase">{error}</div>}
    </div>
  );
}

function DeptSelector({ dept, isSelected, isDisabled, onClick }: any) {
  return (
    <div 
      onClick={() => !isDisabled && onClick()}
      className={`border p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
        isDisabled ? 'border-gray-800 text-gray-700 bg-black/40 cursor-not-allowed' :
        isSelected ? 'border-cyan-400 text-cyan-300 bg-cyan-900/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 
        'border-cyan-900 text-cyan-700 hover:border-cyan-700 hover:bg-cyan-950/10'
      }`}
    >
      <dept.icon className="w-6 h-6" />
      <span className="text-[9px] uppercase tracking-widest text-center">{dept.label}</span>
    </div>
  );
}
