"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { submitRegistration } from "../actions/register";
import { CheckCircle, Loader2, ArrowRight, ArrowLeft, ShieldAlert, Code2, Palette, Megaphone, Users, PenTool } from "lucide-react";
import { DepartmentType } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  { value: DepartmentType.TECHNICAL, label: "Technical", icon: ShieldAlert, color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/50" },
  { value: DepartmentType.WEB_DEVELOPMENT, label: "Web Development", icon: Code2, color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/50" },
  { value: DepartmentType.DESIGN, label: "Design", icon: Palette, color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/50" },
  { value: DepartmentType.SOCIAL_MEDIA, label: "Social Media", icon: Megaphone, color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/50" },
  { value: DepartmentType.EVENT_MANAGEMENT, label: "Event Management", icon: Users, color: "from-indigo-500/20 to-blue-500/20", borderColor: "border-indigo-500/50" },
  { value: DepartmentType.CONTENT_WRITING, label: "Content", icon: PenTool, color: "from-yellow-500/20 to-amber-500/20", borderColor: "border-yellow-500/50" },
];

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      registrationNumber: "",
      phoneNumber: "",
      branch: "",
      year: "",
      section: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      previousExperience: "",
      programmingExperience: "",
      department1: "",
      department2: "",
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['fullName', 'registrationNumber', 'phoneNumber', 'branch', 'year', 'section'];
    if (step === 2) fieldsToValidate = ['department1', 'department2'];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitRegistration(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong during registration.");
      setIsSubmitting(false);
    }
  };

  // Render Department Card for Selection
  const renderDeptCard = (dept: any, preferenceNum: 1 | 2) => {
    const fieldName = preferenceNum === 1 ? 'department1' : 'department2';
    const otherFieldName = preferenceNum === 1 ? 'department2' : 'department1';
    
    const isSelected = form.watch(fieldName) === dept.value;
    const isOtherSelected = form.watch(otherFieldName) === dept.value;
    
    return (
      <motion.div
        key={dept.value}
        whileHover={!isOtherSelected ? { scale: 1.02 } : {}}
        whileTap={!isOtherSelected ? { scale: 0.98 } : {}}
        onClick={() => !isOtherSelected && form.setValue(fieldName, dept.value, { shouldValidate: true })}
        className={`relative overflow-hidden p-4 rounded-xl cursor-pointer transition-all border-2
          ${isSelected ? `bg-gradient-to-br ${dept.color} ${dept.borderColor} shadow-[0_0_20px_rgba(0,255,255,0.2)]` : 
            isOtherSelected ? 'bg-[#0D1117] border-gray-800 opacity-40 cursor-not-allowed' : 
            'bg-[#161B22] border-gray-800 hover:border-gray-600'
          }
        `}
      >
        <div className="flex items-center gap-4 relative z-10">
          <dept.icon className={`w-8 h-8 ${isSelected ? 'text-white drop-shadow-[0_0_10px_currentColor]' : 'text-gray-400'}`} />
          <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{dept.label}</h4>
          {isSelected && <CheckCircle className="w-5 h-5 text-white ml-auto" />}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-8 relative px-4 sm:px-12">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 -translate-y-1/2" />
        <div className={`absolute top-1/2 left-0 h-1 bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)] -z-10 -translate-y-1/2 transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }} />
        
        {[1, 2, 3].map((num) => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 ${step >= num ? 'bg-cyan-900 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-[#0D1117] border-gray-700 text-gray-500'}`}>
            {num}
          </div>
        ))}
      </div>

      <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                  <p className="text-gray-400">Let's get to know you better.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Full Name</Label>
                    <Input {...form.register("fullName")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="John Doe" />
                    {form.formState.errors.fullName && <p className="text-red-400 text-sm">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Registration Number</Label>
                    <Input {...form.register("registrationNumber")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12 uppercase" placeholder="23BCE1234" />
                    {form.formState.errors.registrationNumber && <p className="text-red-400 text-sm">{form.formState.errors.registrationNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Phone Number</Label>
                    <Input {...form.register("phoneNumber")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="9876543210" />
                    {form.formState.errors.phoneNumber && <p className="text-red-400 text-sm">{form.formState.errors.phoneNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Branch</Label>
                    <Input {...form.register("branch")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="CSE Core" />
                    {form.formState.errors.branch && <p className="text-red-400 text-sm">{form.formState.errors.branch.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Year</Label>
                    <Select onValueChange={(val) => form.setValue("year", val)} value={form.watch("year")}>
                      <SelectTrigger className="bg-[#0D1117] border-gray-700 text-white h-12">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161B22] border-gray-700 text-white">
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.year && <p className="text-red-400 text-sm">{form.formState.errors.year.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Section</Label>
                    <Input {...form.register("section")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="A, B, C..." />
                    {form.formState.errors.section && <p className="text-red-400 text-sm">{form.formState.errors.section.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-white mb-2">Department Selection</h2>
                  <p className="text-gray-400">Choose the domains you are most passionate about.</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">Priority 1 (Primary)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DEPARTMENTS.map(dept => renderDeptCard(dept, 1))}
                  </div>
                  {form.formState.errors.department1 && <p className="text-red-400 text-sm">{form.formState.errors.department1.message}</p>}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-purple-400">Priority 2 (Secondary)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DEPARTMENTS.map(dept => renderDeptCard(dept, 2))}
                  </div>
                  {form.formState.errors.department2 && <p className="text-red-400 text-sm">{form.formState.errors.department2.message}</p>}
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Portfolio & Experience</h2>
                  <p className="text-gray-400">Show us what you've built.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">GitHub URL</Label>
                    <Input {...form.register("githubUrl")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">LinkedIn URL</Label>
                    <Input {...form.register("linkedinUrl")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Portfolio Website</Label>
                    <Input {...form.register("portfolioUrl")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 h-12" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="text-gray-300">Hackathon, CTF & Achievements (Previous Experience)</Label>
                  <Textarea {...form.register("previousExperience")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 min-h-[100px]" placeholder="List any hackathons won, CTFs participated in, or other achievements..." />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Projects & Programming Experience</Label>
                  <Textarea {...form.register("programmingExperience")} className="bg-[#0D1117] border-gray-700 text-white focus:border-cyan-500 min-h-[100px]" placeholder="Tell us about the cool projects you've built and technologies you know..." />
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-800 relative z-10">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#0D1117] hover:text-white px-6 h-12 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : <div />}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 h-12 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-all text-lg font-bold">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
