import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as z from "zod";

const formSchema = z.object({
  locations: z.array(z.string()).optional(),
  jobTypes: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const OnboardingLocationPreferences = () => {
  const navigate = useNavigate();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [openLocations, setOpenLocations] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locations: [],
      jobTypes: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Location preferences form submitted:", { 
      ...data, 
      locations: selectedLocations,
      jobTypes: selectedJobTypes 
    });
    // Navigate to sign-up page
    navigate("/onboarding/signup");
  };

  const locations = [
    "Remote",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
    "Boston, MA",
    "El Paso, TX",
    "Nashville, TN",
    "Detroit, MI",
    "Oklahoma City, OK",
    "Portland, OR",
    "Las Vegas, NV",
    "Memphis, TN",
    "Louisville, KY",
    "Baltimore, MD",
    "Milwaukee, WI",
    "Albuquerque, NM",
    "Tucson, AZ",
    "Fresno, CA",
    "Mesa, AZ",
    "Sacramento, CA",
    "Atlanta, GA",
    "Kansas City, MO",
    "Colorado Springs, CO",
    "Miami, FL",
    "Raleigh, NC",
    "Omaha, NE",
    "Long Beach, CA",
    "Virginia Beach, VA",
    "Oakland, CA",
    "Minneapolis, MN",
    "Tulsa, OK",
    "Arlington, TX",
    "Tampa, FL",
    "New Orleans, LA",
    "Wichita, KS",
    "Cleveland, OH",
    "Bakersfield, CA",
    "Aurora, CO",
    "Anaheim, CA",
    "Honolulu, HI",
    "Santa Ana, CA",
    "Riverside, CA",
    "Corpus Christi, TX",
    "Lexington, KY",
    "Stockton, CA",
    "Henderson, NV",
    "Saint Paul, MN",
    "St. Louis, MO",
    "Cincinnati, OH",
    "Pittsburgh, PA",
    "Greensboro, NC",
    "Anchorage, AK",
    "Plano, TX",
    "Lincoln, NE",
    "Orlando, FL",
    "Irvine, CA",
    "Newark, NJ",
    "Durham, NC",
    "Chula Vista, CA",
    "Toledo, OH",
    "Fort Wayne, IN",
    "St. Petersburg, FL",
    "Laredo, TX",
    "Jersey City, NJ",
    "Chandler, AZ",
    "Madison, WI",
    "Lubbock, TX",
    "Scottsdale, AZ",
    "Reno, NV",
    "Buffalo, NY",
    "Gilbert, AZ",
    "Glendale, AZ",
    "North Las Vegas, NV",
    "Winston-Salem, NC",
    "Chesapeake, VA",
    "Norfolk, VA",
    "Fremont, CA",
    "Garland, TX",
    "Irving, TX",
    "Hialeah, FL",
    "Richmond, VA",
    "Boise, ID",
    "Spokane, WA",
    "Baton Rouge, LA",
    "Tacoma, WA",
    "San Bernardino, CA",
    "Modesto, CA",
    "Fontana, CA",
    "Des Moines, IA",
    "Moreno Valley, CA",
    "Santa Clarita, CA",
    "Fayetteville, NC",
    "Birmingham, AL",
    "Oxnard, CA",
    "Rochester, NY",
    "Port St. Lucie, FL",
    "Grand Rapids, MI",
    "Huntsville, AL",
    "Salt Lake City, UT",
    "Frisco, TX",
    "Yonkers, NY",
    "Amarillo, TX",
    "Glendale, CA",
    "Huntington Beach, CA",
    "McKinney, TX",
    "Montgomery, AL",
    "Augusta, GA",
    "Aurora, IL",
    "Akron, OH",
    "Little Rock, AR",
    "Tempe, AZ",
    "Columbus, GA",
    "Overland Park, KS",
    "Grand Prairie, TX",
    "Tallahassee, FL",
    "Cape Coral, FL",
    "Mobile, AL",
    "Knoxville, TN",
    "Shreveport, LA",
    "Worcester, MA",
    "Ontario, CA",
    "Vancouver, WA",
    "Sioux Falls, SD",
    "Chattanooga, TN",
    "Brownsville, TX",
    "Fort Lauderdale, FL",
    "Providence, RI",
    "Newport News, VA",
    "Rancho Cucamonga, CA",
    "Santa Rosa, CA",
    "Peoria, AZ",
    "Oceanside, CA",
    "Elk Grove, CA",
    "Salem, OR",
    "Pembroke Pines, FL",
    "Eugene, OR",
    "Garden Grove, CA",
    "Cary, NC",
    "Fort Collins, CO",
    "Corona, CA",
    "Springfield, MO",
    "Jackson, MS",
    "Alexandria, VA",
    "Hayward, CA",
    "Lancaster, CA",
    "Lakewood, CO",
    "Palmdale, CA",
    "Salinas, CA",
    "Springfield, MA",
    "Pasadena, TX",
    "Sunnyvale, CA",
    "Macon, GA",
    "Pomona, CA",
    "Killeen, TX",
    "Escondido, CA",
    "Kansas City, KS",
    "Hollywood, FL",
    "Clarksville, TN",
    "Rockford, IL",
    "Torrance, CA",
    "Naperville, IL",
    "Joliet, IL",
    "Paterson, NJ",
    "Bridgeport, CT",
    "Mesquite, TX",
    "Sterling Heights, MI",
    "Syracuse, NY",
    "McAllen, TX",
    "Pasadena, CA",
    "Bellevue, WA",
    "Fullerton, CA",
    "Carrollton, TX",
    "Midland, TX",
    "Denton, TX",
    "Roseville, CA",
    "Concord, CA",
    "Thousand Oaks, CA",
    "Cedar Rapids, IA",
    "Round Rock, TX",
    "Stamford, CT",
    "Olathe, KS",
    "Clovis, CA",
    "Waco, TX",
    "Hartford, CT",
    "Visalia, CA",
    "Elizabeth, NJ",
    "Topeka, KS",
    "Thornton, CO",
    "Gainesville, FL",
    "Warren, MI",
    "Dayton, OH",
    "Columbia, SC",
    "West Valley City, UT",
    "Rochester, MN",
    "Norwalk, CA",
    "Carlsbad, CA",
    "Westminster, CO",
    "Pearland, TX",
    "Arvada, CO",
    "Miami Gardens, FL",
    "Temecula, CA",
    "Santa Clara, CA",
    "Sandy Springs, GA",
    "Lansing, MI",
    "Murfreesboro, TN",
    "Pueblo, CO",
    "Wilmington, NC",
    "Costa Mesa, CA",
    "Miami Beach, FL",
    "Inglewood, CA",
    "Clearwater, FL",
    "Ann Arbor, MI",
    "Allentown, PA",
    "Green Bay, WI",
    "Norman, OK",
    "Beaumont, TX",
    "Independence, MO",
    "Murrieta, CA",
    "Elgin, IL",
    "Odessa, TX",
    "Evansville, IN",
    "Provo, UT",
    "Charleston, SC",
    "Antioch, CA",
    "High Point, NC",
    "Centennial, CO",
    "Everett, WA",
    "Richardson, TX",
    "Duluth, MN",
    "Lowell, MA",
    "Wichita Falls, TX",
    "Cambridge, MA",
    "Palm Bay, FL",
    "Victorville, CA",
    "Vallejo, CA",
    "El Monte, CA",
    "Abilene, TX",
    "North Charleston, SC",
    "College Station, TX",
    "Tyler, TX",
    "Hillsboro, OR",
    "Lewisville, TX",
    "Billings, MT",
    "West Palm Beach, FL",
    "Berkeley, CA",
    "Broken Arrow, OK",
    "West Jordan, UT",
    "Jurupa Valley, CA",
    "Rialto, CA",
    "Las Cruces, NM",
    "Burbank, CA",
    "Renton, WA",
    "Woodbridge, NJ",
    "Davie, FL",
    "Other"
  ];

  const jobTypes = [
    { id: "internship", label: "Internship" },
    { id: "part-time", label: "Part-Time" },
    { id: "full-time", label: "Full-Time" },
  ];

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleJobType = (jobTypeId: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobTypeId) 
        ? prev.filter(jt => jt !== jobTypeId)
        : [...prev, jobTypeId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/onboarding/opportunity-preferences")}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="w-full max-w-2xl space-y-4">
        <Progress value={80} className="w-full" />
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Location Preferences</CardTitle>
            <p className="text-muted-foreground">Tell us where you'd like to work</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferred Locations</h3>
                  <p className="text-sm text-muted-foreground">Select all locations where you'd like to work</p>
                  
                  <Popover open={openLocations} onOpenChange={setOpenLocations}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          selectedLocations.length === 0 && "text-muted-foreground"
                        )}
                      >
                        {selectedLocations.length === 0
                          ? "Select locations..."
                          : `${selectedLocations.length} selected`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search locations..." />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                value={location}
                                key={location}
                                onSelect={() => {
                                  toggleLocation(location);
                                  // Don't close the dropdown to allow multiple selections
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLocations.includes(location)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {location}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.map((location) => (
                        <Badge 
                          key={location} 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-secondary/80"
                          onClick={() => toggleLocation(location)}
                        >
                          {location} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Job Type(s) Interested In</h3>
                  <p className="text-sm text-muted-foreground">Select all job types you're interested in</p>
                  <div className="space-y-3">
                    {jobTypes.map((jobType) => (
                      <div key={jobType.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={jobType.id}
                          checked={selectedJobTypes.includes(jobType.id)}
                          onCheckedChange={() => toggleJobType(jobType.id)}
                        />
                        <label
                          htmlFor={jobType.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {jobType.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingLocationPreferences;
