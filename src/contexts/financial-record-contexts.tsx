import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();
  const fetchRecord = async () => {
    if (!user) return;
    const response = await fetch(
      `https://finance-tracker-backend-hamw.onrender.com/financial-record/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch(' https://finance-tracker-backend-hamw.onrender.com/financial-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error('Failed to add record:', response.statusText);
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    const response = await fetch(
      ` https://finance-tracker-backend-hamw.onrender.com/financial-record/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      }
    );

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          })
        );
      } else {
        console.error('Failed to add record:', response.statusText);
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const deleteRecord = async(id:string)=>{
 const response = await fetch(`https://finance-tracker-backend-hamw.onrender.com/financial-record/${id}`, {
   method: 'DELETE'
 });

 try {
   if (response.ok) {
     const deleteRecord = await response.json();
     setRecords((prev) => prev.filter((record)=>record._id !== deleteRecord._id ));
   } else {
     console.error('Failed to add record:', response.statusText);
   }
 } catch (err) {
   console.error('Error adding record:', err);
 }
  }

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord,deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );
  if (!context) {
    throw new Error(
      'useFinancialRecord must be used within a FinancialRecordProvider'
    );
  }
  return context;
};
