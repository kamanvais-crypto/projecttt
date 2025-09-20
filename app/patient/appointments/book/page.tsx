'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/language-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Languages, 
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle
} from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  languages: string[];
  availability: boolean;
  rating: number;
  avatar?: string;
}

interface Symptom {
  id: string;
  name: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isDoctor } = useAuth();
  const { t, language } = useLanguage();
  const { showNotification } = useNotification();
  
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (!isAuthenticated || isDoctor) {
      router.push('/');
    }
  }, [isAuthenticated, isDoctor, router]);

  // Mock data - in a real app, this would come from an API
  const doctors: Doctor[] = [
    { 
      id: 1, 
      name: 'Dr. Priya Sharma', 
      specialization: 'General Physician', 
      languages: ['english', 'hindi'], 
      availability: true, 
      rating: 4.8,
      avatar: '/avatars/doctor-1.jpg'
    },
    { 
      id: 2, 
      name: 'Dr. Rajesh Kumar', 
      specialization: 'Pediatrician', 
      languages: ['hindi', 'tamil'], 
      availability: true, 
      rating: 4.5,
      avatar: '/avatars/doctor-2.jpg'
    },
    { 
      id: 3, 
      name: 'Dr. Ananya Patel', 
      specialization: 'Gynecologist', 
      languages: ['english', 'hindi'], 
      availability: false, 
      rating: 4.9,
      avatar: '/avatars/doctor-3.jpg'
    },
  ];

  const symptoms: Record<string, string[]> = {
    english: [
      "Fever", "Cough", "Headache", "Sore throat", "Body ache", 
      "Fatigue", "Nausea", "Vomiting", "Diarrhea", "Shortness of breath",
      "Chest pain", "Abdominal pain", "Dizziness", "Skin rash", "Joint pain"
    ],
    hindi: [
      "बुखार", "खांसी", "सिरदर्द", "गले में खराश", "शरीर में दर्द",
      "थकान", "मतली", "उल्टी", "दस्त", "सांस की तकलीफ",
      "छाती में दर्द", "पेट में दर्द", "चक्कर आना", "त्वचा पर दाने", "जोड़ों में दर्द"
    ],
    tamil: [
      "காய்ச்சல்", "இருமல்", "தலைவலி", "தொண்டை வலி", "உடல் வலி",
      "சோர்வு", "குமட்டல்", "வாந்தி", "வயிற்றுப்போக்கு", "மூச்சுத் திணறல்",
      "மார்பு வலி", "வயிற்று வலி", "தலைச்சுற்றல்", "தோல் தடிப்பு", "மூட்டு வலி"
    ]
  };

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    return date.toISOString().split('T')[0];
  });

  // Generate available time slots
  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '2:00 PM', '3:00 PM', 
    '4:00 PM', '5:00 PM'
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = doctor.languages.includes(language);
    
    return matchesSearch && matchesLanguage && doctor.availability;
  });

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    handleNextStep();
  };

  const handleBookAppointment = () => {
    // In a real app, this would make an API call to book the appointment
    showNotification(t('appointmentBooked'), 'success');
    router.push('/patient/dashboard');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('symptoms')}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select all symptoms that apply to you:
              </p>
              <div className="flex flex-wrap gap-2">
                {symptoms[language as keyof typeof symptoms]?.map((symptom, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                onClick={() => router.push('/patient/dashboard')}
                variant="ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('back')}
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={selectedSymptoms.length === 0}
              >
                {t('next')}
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('availableDoctors')}</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-3">
                {filteredDoctors.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No doctors available matching your criteria.
                  </p>
                ) : (
                  filteredDoctors.map(doctor => (
                    <Card 
                      key={doctor.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectDoctor(doctor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={doctor.avatar} />
                              <AvatarFallback>
                                <Stethoscope className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                              <div className="flex items-center mt-1 space-x-3">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm">{doctor.rating}</span>
                                </div>
                                <div className="flex items-center">
                                  <Languages className="w-4 h-4 text-muted-foreground mr-1" />
                                  <span className="text-sm text-muted-foreground">
                                    {doctor.languages.map(lang => 
                                      lang.charAt(0).toUpperCase() + lang.slice(1)
                                    ).join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                onClick={handlePreviousStep}
                variant="ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('back')}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t('confirmAppointment')}</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {user?.name}</p>
                    <p className="text-sm"><strong>Phone:</strong> {user?.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {selectedDoctor?.name}</p>
                    <p className="text-sm"><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {selectedSymptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Date</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map((date, index) => (
                        <button
                          key={index}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedDate === date
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Time</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTimes.map((time, index) => (
                        <button
                          key={index}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedTime === time
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button 
                onClick={handlePreviousStep}
                variant="ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('back')}
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('confirmAppointment')}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold logo-text">{t('bookAppointment')}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/patient/dashboard')}
            >
              ×
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}