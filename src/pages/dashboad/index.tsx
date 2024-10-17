import { useUser } from '@clerk/clerk-react';
import { FinancialRecordList } from './financial-record-list';
import { FinancialRecordForm } from './financial-record-form';
import './financial-record.css';
import { useFinancialRecords } from '../../contexts/financial-record-contexts';
import {  useMemo } from 'react'
import { Navigate } from 'react-router-dom';
export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName} ! Here are your Finance:</h1>
      <FinancialRecordForm />
      <div>Total Monthly: ₹{totalMonthly}</div>
      <FinancialRecordList />
    </div>
  );
};
