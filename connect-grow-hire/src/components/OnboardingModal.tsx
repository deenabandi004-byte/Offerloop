import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const universities = [
  "Other",
  "Abilene Christian University",
  "Adelphi University",
  "Agnes Scott College",
  "Air Force Academy (USAFA)",
  "Alabama A&M University",
  "Alabama State University",
  "Alaska Pacific University",
  "Albany State University",
  "Alcorn State University",
  "American University",
  "Amherst College",
  "Appalachian State University",
  "Arizona State University",
  "Arkansas State University",
  "Auburn University",
  "Augsburg University",
  "Augustana College",
  "Babson College",
  "Ball State University",
  "Bard College",
  "Barnard College",
  "Barry University",
  "Baylor University",
  "Bellarmine University",
  "Belmont University",
  "University of Warwick",
  "University of Zurich"
];

type OnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      university: "",
    },
  });

  const onSubmit = (data: FormData) => {
    onOpenChange(false);
    navigate("/onboarding/academics");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome to Offerloop.ai</DialogTitle>
          <DialogDescription>Let's get started with your profile</DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-4 p-6 pt-0">
          <Progress value={15} className="w-full" />
          <div className="w-full">
            <div className="text-center p-0 pb-4">
              <h2 className="text-xl font-bold">Get Started</h2>
              <p className="text-sm text-gray-600">Let's set up your profile</p>
            </div>
            <div className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">What's your name?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University (Optional)</FormLabel>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={popoverOpen}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? universities.find((university) => university === field.value)
                                  : "Select university..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search university..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No university found.</CommandEmpty>
                                <CommandGroup>
                                  {universities.map((university) => (
                                    <CommandItem
                                      key={university}
                                      value={university}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue === field.value ? "" : currentValue)
                                        setPopoverOpen(false)
                                      }}
                                    >
                                      {university}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === university ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Continue
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
