'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  FileText, 
  Heart, 
  Phone, 
  Video, 
  User,
  Home,
  CalendarPlus,
  Stethoscope,
  Plus
} from 'lucide-react';

export default function PatientDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isDoctor } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated || isDoctor) {
      router.push('/');
    } else {
      // Load user's appointments from localStorage
      const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const userAppointments = storedAppointments.filter((apt: any) => 
        apt.patientId === user?.id
      );
      setUpcomingAppointments(userAppointments.slice(0, 3)); // Show only first 3
    }
  }, [isAuthenticated, isDoctor, router, user]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      specialization: 'General Physician',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed',
      avatar: '/avatars/doctor-1.jpg'
    }
  ]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold logo-text">SwasthGuru</h1>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/patient/profile')}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Welcome Section */}
        <Card className="mb-6 gradient-bg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{t('welcome')}, {user.name}</h2>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
              <Button 
                onClick={() => router.push('/patient/appointments/book')}
                className="mt-4 md:mt-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('bookAppointment')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Appointments', value: upcomingAppointments.length.toString(), icon: Calendar, color: 'bg-primary/10 text-primary' },
            { label: 'This Month', value: upcomingAppointments.length.toString(), icon: CalendarPlus, color: 'bg-secondary/10 text-secondary' },
            { label: 'Records', value: '8', icon: FileText, color: 'bg-accent/10 text-accent' },
            { label: 'Health Score', value: '85%', icon: Heart, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('upcomingAppointments')}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/patient/appointments')}
            >
              {t('viewDetails')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={appointment.avatar} />
                    <AvatarFallback>
                      <Stethoscope className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctorSpecialization || appointment.specialization}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {appointment.status}
                  </Badge>
                  {appointment.status === 'confirmed' && (
                    <Button size="sm" onClick={() => router.push('/patient/consultation')}>
                    <Button size="sm" onClick={() => router.push(`/patient/consultation/${appointment.id}`)}>
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button onClick={() => router.push('/patient/appointments/book')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/patient/records')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('medicalRecords')}</h3>
              <p className="text-sm text-muted-foreground">Access your medical history</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('healthTips')}</h3>
              <p className="text-sm text-muted-foreground">Daily health recommendations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t('emergency')}</h3>
              <p className="text-sm text-muted-foreground">Call emergency services</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-3 text-primary"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">{t('home')}</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-3"
              onClick={() => router.push('/patient/appointments/book')}
            >
              <CalendarPlus className="w-5 h-5" />
              <span className="text-xs mt-1">{t('appointments')}</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-3"
              onClick={() => router.push('/patient/records')}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-1">{t('medicalRecords')}</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-3"
              onClick={() => router.push('/patient/profile')}
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">{t('profile')}</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}