import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Import components with error handling
let LoginScreen, Dashboard, AppointmentsList, BookAppointmentForm, RecordForm, PatientSearch, PatientProfile, PatientHistory, Layout;

try {
  LoginScreen = require('./components/Auth/LoginScreen').default;
} catch (e) {
  console.error('Failed to import LoginScreen:', e);
  LoginScreen = () => <div>Error: LoginScreen component not found</div>;
}

try {
  Dashboard = require('./components/Dashboard/Dashboard').default;
} catch (e) {
  console.error('Failed to import Dashboard:', e);
  Dashboard = () => <div>Error: Dashboard component not found</div>;
}

try {
  AppointmentsList = require('./components/Appointments/AppointmentsList').default;
} catch (e) {
  console.error('Failed to import AppointmentsList:', e);
  AppointmentsList = () => <div>Error: AppointmentsList component not found</div>;
}

try {
  BookAppointmentForm = require('./components/Appointments/BookAppointmentForm').default;
} catch (e) {
  console.error('Failed to import BookAppointmentForm:', e);
  BookAppointmentForm = () => <div>Error: BookAppointmentForm component not found</div>;
}

try {
  RecordForm = require('./components/Appointments/RecordForm').default;
} catch (e) {
  console.error('Failed to import RecordForm:', e);
  RecordForm = () => <div>Error: RecordForm component not found</div>;
}

try {
  PatientSearch = require('./components/Patients/PatientSearch').default;
} catch (e) {
  console.error('Failed to import PatientSearch:', e);
  PatientSearch = () => <div>Error: PatientSearch component not found</div>;
}

try {
  PatientProfile = require('./components/Patients/PatientProfile').default;
} catch (e) {
  console.error('Failed to import PatientProfile:', e);
  PatientProfile = () => <div>Error: PatientProfile component not found</div>;
}

try {
  PatientHistory = require('./components/Patients/PatientHistory').default;
} catch (e) {
  console.error('Failed to import PatientHistory:', e);
  PatientHistory = () => <div>Error: PatientHistory component not found</div>;
}

try {
  Layout = require('./components/Layout/Layout').default;
} catch (e) {
  console.error('Failed to import Layout:', e);
  Layout = ({ children }) => <div>Error: Layout component not found. Content: {children}</div>;
}

const supabaseUrl = 'https://ndzxqgacvdbcnyfidupb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kenhxZ2FjdmRiY255ZmlkdXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzgwNDMsImV4cCI6MjA3MzE1NDA0M30.BvLuh6DTeJws-kSUBUFcv62HkNWIsCZ3utV09Li1_Qk';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [completedToday, setCompletedToday] = useState(0); // New counter
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(null);
  const [recordAppointmentDetails, setRecordAppointmentDetails] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [patientHistoryData, setPatientHistoryData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchAppointments(session.user.id);
        fetchCompletedToday(session.user.id); // Load initial count
        fetchPatients();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchAppointments(session.user.id);
        fetchCompletedToday(session.user.id);
        fetchPatients();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppointments = async (nurseId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status, patients(first_name, last_name)')
      .eq('nurse_id', nurseId)
      .eq('status', 'Scheduled')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    if (error) {
      console.error('Fetch error:', error);
      alert('Oops! Couldn\'t load appointments. Check console.');
    } else {
      const unique = [...new Map(data.map(item => [item.id, item])).values()];
      setAppointments(unique);
    }
  };

  const fetchCompletedToday = async (nurseId) => {
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-09-12"
    const { data, error } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('nurse_id', nurseId)
      .eq('status', 'Completed')
      .gte('appointment_date', today)
      .lte('appointment_date', today);
    if (error) console.error('Completed today count error:', error);
    else setCompletedToday(data.length || 0);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase.from('patients').select('*');
    if (error) console.error('Error fetching patients:', error);
    else setPatients(data || []);
  };

  const fetchVisitHistory = async (patientId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status, patient_records(notes, vitals, recorded_at)')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    if (error) console.error('Error fetching history:', error);
    return data || [];
  };

  const handleBookAppointment = async ({ patientId, date, time }) => {
    if (!patientId || !date || !time) return { success: false, error: 'Please fill all fields!' };
    const { error } = await supabase.from('appointments').insert({
      patient_id: patientId,
      nurse_id: session.user.id,
      appointment_date: date,
      appointment_time: time,
      status: 'Scheduled',
    });
    if (error) return { success: false, error: 'Booking failed. Try again!' };
    await fetchAppointments(session.user.id);
    return { success: true };
  };

  const handleCompleteAppointment = async (appointmentId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, patients(first_name, last_name), appointment_date')
      .eq('id', appointmentId)
      .eq('nurse_id', session.user.id)
      .single();
    if (error) {
      console.error('Complete error:', error);
      alert('Oops! Couldn\'t find appointment.');
      return;
    }
    setRecordAppointmentDetails({
      patientName: `${data.patients.first_name} ${data.patients.last_name}`,
      appointmentDate: new Date(data.appointment_date).toLocaleDateString(),
    });
    setShowRecordForm(appointmentId);
  };

  const handleSaveRecord = async ({ notes, vitals }) => {
    if (!notes || !showRecordForm) return { success: false, error: 'Please enter notes before saving.' };
    const { error: insertError } = await supabase
      .from('patient_records')
      .insert({
        appointment_id: showRecordForm,
        notes,
        vitals: vitals ? JSON.parse(vitals) : {},
      });
    if (insertError) {
      console.error('Insert error:', insertError);
      return { success: false, error: 'Failed to save notes. Try again!' };
    }
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'Completed' })
      .eq('id', showRecordForm)
      .eq('nurse_id', session.user.id);
    if (updateError) {
      console.error('Status update error:', updateError);
      alert('Notes saved, but status change failed. Check console or RLS policy!');
      return { success: false, error: 'Status update failed—appointment still shows upcoming.' };
    }
    setShowRecordForm(null);
    setRecordAppointmentDetails(null);
    await fetchAppointments(session.user.id);
    await fetchCompletedToday(session.user.id); // Update counter
    return { success: true };
  };

  const handleSearchPatients = async (searchTerm) => {
    if (!searchTerm.trim()) {
      await fetchPatients();
      return;
    }
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
    if (error) console.error('Error searching patients:', error);
    else setPatients(data || []);
  };

  const handleViewPatientProfile = (patient) => setSelectedPatientProfile(patient);
  const handleViewPatientHistory = async (patient) => {
    const history = await fetchVisitHistory(patient.id);
    setSelectedPatientHistory(patient);
    setPatientHistoryData(history);
  };

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
  };

  if (!session) return <LoginScreen onLogin={handleLogin} />;

  return (
    <Layout onLogout={handleLogout} session={session}>
      <Dashboard
        appointments={appointments}
        onBookAppointment={() => setShowBookingForm(true)}
        onSearchPatients={() => setShowPatientSearch(true)}
        onCompleteAppointment={handleCompleteAppointment}
        completedToday={completedToday} // Pass to Dashboard
      />
      <BookAppointmentForm
        open={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        onSubmit={handleBookAppointment}
        patients={patients}
      />
      <RecordForm
        open={!!showRecordForm}
        onClose={() => {
          setShowRecordForm(null);
          setRecordAppointmentDetails(null);
        }}
        onSubmit={handleSaveRecord}
        appointmentDetails={recordAppointmentDetails}
      />
      <PatientSearch
        open={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        patients={patients}
        onSearch={handleSearchPatients}
        onViewProfile={handleViewPatientProfile}
        onViewHistory={handleViewPatientHistory}
      />
      <PatientProfile
        open={!!selectedPatientProfile}
        onClose={() => setSelectedPatientProfile(null)}
        patient={selectedPatientProfile}
      />
      <PatientHistory
        open={!!selectedPatientHistory}
        onClose={() => {
          setSelectedPatientHistory(null);
          setPatientHistoryData(null);
        }}
        patient={selectedPatientHistory}
        history={patientHistoryData}
      />
    </Layout>
  );
}

export default App;