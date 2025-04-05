import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const VehicleInfoPage = () => {
  const navigate = useNavigate();
  const [violation, setViolation] = useState(null);

  useEffect(() => {
    const fetchLatestViolation = async () => {
      try {
        const response = await api.get('/api/violations');
        if (response.data.length > 0) {
          setViolation(response.data[0]);
        } else {
          navigate('/police/violation-entry');
        }
      } catch (error) {
        console.error('Failed to fetch violation:', error);
        navigate('/police/violation-entry');
      }
    };

    fetchLatestViolation();
  }, [navigate]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const handleSubmit = async () => {
    try {
      navigate('/police/confirmation');
    } catch (error) {
      console.error('Failed to submit violation:', error);
    }
  };

  if (!violation) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Vehicle Owner</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {violation.owner_name}</p>
              <p><span className="font-semibold">Plate:</span> {violation.license_plate}</p>
              <p><span className="font-semibold">Insurance Policy:</span> {violation.insurance_policy}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Violation Details</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Type:</span> {violation.violation_type}</p>
              <p><span className="font-semibold">Location:</span> {violation.location}</p>
              <p><span className="font-semibold">Date/Time:</span> {formatDate(violation.violation_date)}</p>
              <p><span className="font-semibold">Amount:</span> {violation.fine_amount} DA</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Violation
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoPage;