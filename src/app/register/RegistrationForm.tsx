"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations/registration";
import { useState } from "react";
import { submitRegistration } from "../actions/register";
import { ShieldAlert, Code2, Palette, Megaphone, Users, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  { value: "TECHNICAL", label: "Technical", icon: ShieldAlert, desc: "Offensive & Defensive Security" },
  { value: "WEB_DEVELOPMENT", label: "Web Development", icon: Code2, desc: "Build scalable platforms" },
  { value: "DESIGN", label: "Design", icon: Palette, desc: "Visual aesthetics & UX" },
  { value: "SOCIAL_MEDIA", label: "Social Media", icon: Megaphone, desc: "Digital presence & outreach" },
  { value: "EVENT_MANAGEMENT", label: "Event Management", icon: Users, desc: "Logistics and execution" },
  { value: "OUTREACH", label: "Outreach", icon: MessageSquare, desc: "Partnerships and Communication" },
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
      const result = await submitRegistration(data);
      if (result && result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
      // Handle success redirect or state here
      window.location.href = "/assessment";
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
      setIsSubmitting(false);
    }
  };

  // Watch departments to calculate selections
  const d1 = form.watch("department1");
  const d2 = form.watch("department2");
  const selectedCount = (d1 ? 1 : 0) + (d2 ? 1 : 0);

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-xs font-mono tracking-[0.2em] text-[#626A72] mb-4 uppercase">RECRUITMENT 2026</h2>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F1F0EA] mb-4 uppercase">Applicant Profile</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-1 rounded-sm ${step >= 1 ? 'bg-[#F1F0EA]' : 'bg-white/10'}`} />
            <span className={`text-xs font-mono ${step >= 1 ? 'text-[#F1F0EA]' : 'text-[#626A72]'}`}>IDENTITY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-1 rounded-sm ${step >= 2 ? 'bg-[#F1F0EA]' : 'bg-white/10'}`} />
            <span className={`text-xs font-mono ${step >= 2 ? 'text-[#F1F0EA]' : 'text-[#626A72]'}`}>DEPARTMENTS</span>
          </div>
        </div>
      </div>

      <div className="bg-[#10151A] border border-white/5 rounded-sm p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Glass gradient */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div key="1" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{ duration: 0.3 }} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputRow label="Full Name" error={form.formState.errors.fullName?.message}>
                    <input {...form.register("fullName")} className="cyscom-input" placeholder="e.g. Alan Turing" />
                  </InputRow>
                  
                  <InputRow label="Registration Number" error={form.formState.errors.registrationNumber?.message}>
                    <input {...form.register("registrationNumber")} className="cyscom-input uppercase" placeholder="e.g. 23BCE1234" />
                  </InputRow>

                  <InputRow label="Phone Number" error={form.formState.errors.phoneNumber?.message}>
                    <input {...form.register("phoneNumber")} className="cyscom-input" placeholder="+91 0000000000" />
                  </InputRow>

                  <InputRow label="Branch" error={form.formState.errors.branch?.message}>
                    <input {...form.register("branch")} className="cyscom-input" placeholder="e.g. CSE Core" />
                  </InputRow>

                  <div className="md:col-span-2">
                    <InputRow label="Current Year" error={form.formState.errors.year?.message}>
                      <select {...form.register("year")} className="cyscom-input cursor-pointer appearance-none">
                        <option value="" disabled className="bg-[#0A1110] text-[#626A72]">Select your current year of study</option>
                        <option value="1st Year" className="bg-[#0A1110]">1st Year</option>
                        <option value="2nd Year" className="bg-[#0A1110]">2nd Year</option>
                        <option value="3rd Year" className="bg-[#0A1110]">3rd Year</option>
                      </select>
                    </InputRow>
                  </div>
                </div>

                <div className="pt-6 flex justify-end border-t border-white/10">
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-[#050608] text-[#F1F0EA] border border-white/10 rounded-sm font-bold text-xs tracking-widest hover:border-[#67E8F9] hover:text-[#67E8F9] hover:shadow-[0_0_15px_rgba(103,232,249,0.15)] transition-all flex items-center gap-2 uppercase">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DEPARTMENTS */}
            {step === 2 && (
              <motion.div key="2" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{ duration: 0.3 }} className="space-y-8">
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center gap-2 bg-[#050608] border border-white/10 px-4 py-2 rounded-sm mb-4">
                    <span className="text-[#F1F0EA] font-mono text-xs">{selectedCount} / 2 SELECTED</span>
                  </div>
                  <p className="text-[#A4A8AE] font-mono text-xs uppercase tracking-wider">Select exactly two departments you wish to apply for.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = d1 === dept.value || d2 === dept.value;
                    const isDisabled = !isSelected && selectedCount >= 2;

                    return (
                      <div 
                        key={dept.value}
                        onClick={() => {
                          if (isSelected) {
                            if (d1 === dept.value) form.setValue("department1", "", {shouldValidate: true});
                            if (d2 === dept.value) form.setValue("department2", "", {shouldValidate: true});
                          } else if (!isDisabled) {
                            if (!d1) form.setValue("department1", dept.value, {shouldValidate: true});
                            else if (!d2) form.setValue("department2", dept.value, {shouldValidate: true});
                          }
                        }}
                        className={`group relative p-4 rounded-sm border transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected 
                            ? 'bg-[#67E8F9]/5 border-[#67E8F9] shadow-[0_0_15px_rgba(103,232,249,0.1)]' 
                            : isDisabled 
                              ? 'opacity-40 cursor-not-allowed border-white/5 bg-transparent' 
                              : 'border-white/10 hover:border-white/30 hover:bg-[#050608] bg-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-sm transition-colors ${isSelected ? 'bg-[#67E8F9]/20 text-[#67E8F9]' : 'bg-[#050608] border border-white/5 text-[#626A72] group-hover:text-[#F1F0EA]'}`}>
                          <dept.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-[#67E8F9]' : 'text-[#F1F0EA]'}`}>{dept.label}</h4>
                          <p className="text-xs text-[#626A72] font-mono">{dept.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-[#67E8F9]">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Validation Warnings */}
                {(form.formState.errors.department1 || form.formState.errors.department2) && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>You must select exactly two departments to proceed.</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="p-4 bg-[#050608] border border-white/5 rounded-sm">
                  <p className="text-xs text-[#A4A8AE] leading-relaxed font-mono">
                    <strong className="text-[#F1F0EA]">Important:</strong> These departments will be locked once your assessment begins. Please choose carefully based on your interests and skills.
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-white/10">
                  <button type="button" onClick={prevStep} className="text-[#626A72] text-xs font-bold uppercase tracking-widest hover:text-[#F1F0EA] transition-colors">
                    Back to Profile
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || selectedCount !== 2} 
                    className="px-8 py-3 bg-[#050608] text-[#F1F0EA] border border-[#00D9FF]/30 hover:border-[#67E8F9] hover:text-[#67E8F9] hover:shadow-[0_0_15px_rgba(103,232,249,0.15)] font-bold text-xs tracking-widest rounded-sm transition-all flex items-center gap-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Start Assessment"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <style jsx global>{`
        .cyscom-input {
          @apply w-full bg-[#050608] border border-white/10 text-[#F1F0EA] px-4 py-3 rounded-sm focus:outline-none focus:border-white/30 transition-all text-sm placeholder:text-[#626A72] font-mono;
        }
      `}</style>
    </div>
  );
}

// Helpers
function InputRow({ label, error, children }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono text-[#A4A8AE] uppercase tracking-wider">{label}</label>
      {children}
      {error && <span className="text-xs font-mono text-red-500">{error}</span>}
    </div>
  );
}
