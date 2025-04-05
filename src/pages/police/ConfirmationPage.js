import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  // In a real app, you would get this from the backend or context
  const violation = {
    license_plate: '123ABC456',
    fine_amount: 5000,
    violation_date: new Date(),
  };

  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Violation Recorded Successfully</h1>
        
        <p className="mb-6">
          A notification has been sent to the owner of vehicle {violation.license_plate}
        </p>
        
        <p className="font-semibold mb-8">
          Fine amount: {formatCurrency(violation.fine_amount)} DA
        </p>
        
        <button
          onClick={() => navigate('/police')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;