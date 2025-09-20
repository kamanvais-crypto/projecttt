'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'english' | 'hindi' | 'tamil';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations = {
  english: {
    welcome: 'Welcome to SwasthGuru',
    tagline: 'Healthcare at your fingertips',
    login: 'Login',
    register: 'Register',
    patient: 'Patient',
    doctor: 'Doctor',
    phoneNumber: 'Phone Number',
    password: 'Password',
    email: 'Email Address',
    name: 'Full Name',
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    bookAppointment: 'Book Appointment',
    myAppointments: 'My Appointments',
    medicalRecords: 'Medical Records',
    profile: 'Profile',
    logout: 'Logout',
    symptoms: 'Select Symptoms',
    availableDoctors: 'Available Doctors',
    confirmAppointment: 'Confirm Appointment',
    appointmentBooked: 'Appointment Booked Successfully!',
    joinConsultation: 'Join Consultation',
    cancel: 'Cancel',
    reschedule: 'Reschedule',
    home: 'Home',
    findDoctor: 'Find Doctor',
    bookNow: 'Book Now',
    viewDetails: 'View Details',
    healthTips: 'Health Tips',
    emergency: 'Emergency',
    call: 'Call',
    message: 'Message',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    next: 'Next',
    back: 'Back',
    submit: 'Submit',
    chooseLanguage: 'Choose Your Language',
    userType: 'I am a',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    enterOTP: 'Enter OTP sent to your phone',
    otpInfo: "We'll send a 6-digit code to verify your number",
    uploadReport: 'Upload Report',
    endCall: 'End Call',
    patientDetails: 'Patient Details',
    writeNote: 'Write Note',
    submitPrescription: 'Submit Prescription',
    upcomingAppointments: 'Upcoming Appointments',
  },
  hindi: {
    welcome: 'स्वस्थगुरु में आपका स्वागत है',
    tagline: 'आपकी उंगलियों पर स्वास्थ्य सेवा',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    patient: 'रोगी',
    doctor: 'डॉक्टर',
    phoneNumber: 'फोन नंबर',
    password: 'पासवर्ड',
    email: 'ईमेल पता',
    name: 'पूरा नाम',
    dashboard: 'डैशबोर्ड',
    appointments: 'अपॉइंटमेंट',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    myAppointments: 'मेरे अपॉइंटमेंट',
    medicalRecords: 'मेडिकल रिकॉर्ड',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    symptoms: 'लक्षण चुनें',
    availableDoctors: 'उपलब्ध डॉक्टर',
    confirmAppointment: 'अपॉइंटमेंट की पुष्टि करें',
    appointmentBooked: 'अपॉइंटमेंट सफलतापूर्वक बुक किया गया!',
    joinConsultation: 'परामर्श में शामिल हों',
    cancel: 'रद्द करें',
    reschedule: 'पुनर्निर्धारित करें',
    home: 'होम',
    findDoctor: 'डॉक्टर ढूंढें',
    bookNow: 'अभी बुक करें',
    viewDetails: 'विवरण देखें',
    healthTips: 'स्वास्थ्य टिप्स',
    emergency: 'आपातकालीन',
    call: 'कॉल करें',
    message: 'संदेश',
    date: 'तारीख',
    time: 'समय',
    status: 'स्थिति',
    confirmed: 'पुष्टि की गई',
    pending: 'लंबित',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    next: 'अगला',
    back: 'पीछे',
    submit: 'जमा करें',
    chooseLanguage: 'अपनी भाषा चुनें',
    userType: 'मैं हूँ',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'OTP सत्यापित करें',
    enterOTP: 'आपके फोन पर भेजे गए OTP दर्ज करें',
    otpInfo: 'हम आपके नंबर को सत्यापित करने के लिए 6-अंकों का कोड भेजेंगे',
    uploadReport: 'रिपोर्ट अपलोड करें',
    endCall: 'कॉल समाप्त करें',
    patientDetails: 'रोगी का विवरण',
    writeNote: 'नोट लिखें',
    submitPrescription: 'प्रिस्क्रिप्शन जमा करें',
    upcomingAppointments: 'आगामी अपॉइंटमेंट',
  },
  tamil: {
    welcome: 'ஸ்வஸ்த்குரு-வுக்கு வரவேற்கிறோம்',
    tagline: 'உங்கள் விரல்நுனியில் சுகாதார சேவை',
    login: 'உள்நுழைய',
    register: 'பதிவு செய்ய',
    patient: 'நோயாளி',
    doctor: 'மருத்துவர்',
    phoneNumber: 'தொலைபேசி எண்',
    password: 'கடவுச்சொல்',
    email: 'மின்னஞ்சல் முகவரி',
    name: 'முழு பெயர்',
    dashboard: 'டாஷ்போர்டு',
    appointments: 'சந்திப்புகள்',
    bookAppointment: 'சந்திப்பை முன்பதிவு செய்ய',
    myAppointments: 'எனது சந்திப்புகள்',
    medicalRecords: 'மருத்துவ பதிவுகள்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    symptoms: 'அறிகுறிகளைத் தேர்ந்தெடுக்கவும்',
    availableDoctors: 'கிடைக்கக்கூடிய மருத்துவர்கள்',
    confirmAppointment: 'சந்திப்பை உறுதிப்படுத்தவும்',
    appointmentBooked: 'சந்திப்பு வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது!',
    joinConsultation: 'ஆலோசனையில் சேரவும்',
    cancel: 'ரத்து செய்ய',
    reschedule: 'மறுபதிவு செய்ய',
    home: 'முகப்பு',
    findDoctor: 'மருத்துவரைக் கண்டறிய',
    bookNow: 'இப்போது முன்பதிவு செய்ய',
    viewDetails: 'விவரங்களைக் காண',
    healthTips: 'ஆரோக்கிய குறிப்புகள்',
    emergency: 'அவசர',
    call: 'அழைப்பு',
    message: 'செய்தி',
    date: 'தேதி',
    time: 'நேரம்',
    status: 'நிலை',
    confirmed: 'உறுதிப்படுத்தப்பட்டது',
    pending: 'நிலுவையில் உள்ளது',
    completed: 'முடிக்கப்பட்டது',
    cancelled: 'ரத்து செய்யப்பட்டது',
    next: 'அடுத்து',
    back: 'பின்',
    submit: 'சமர்ப்பிக்க',
    chooseLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    userType: 'நான் ஒரு',
    sendOTP: 'OTP அனுப்பு',
    verifyOTP: 'OTP சரிபார்க்க',
    enterOTP: 'உங்கள் தொலைபேசிக்கு அனுப்பப்பட்ட OTP-ஐ உள்ளிடவும்',
    otpInfo: 'உங்கள் எண்ணை சரிபார்க்க 6-இலக்க குறியீட்டை அனுப்புவோம்',
    uploadReport: 'அறிக்கையை பதிவேற்றுக',
    endCall: 'அழைப்பை முடிக்க',
    patientDetails: 'நோயாளி விவரங்கள்',
    writeNote: 'குறிப்பு எழுதுக',
    submitPrescription: 'மருந்து சீட்டை சமர்ப்பிக்க',
    upcomingAppointments: 'வரவிருக்கும் சந்திப்புகள்',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasthguru_language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swasthguru_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  const isRTL = false; // None of our supported languages are RTL

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}