import React, { Suspense, useCallback, useEffect, useState } from "react";
import "../allFormCss/From.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSpinner } from "@coreui/react";

import PDF from "../pdf/PDF";

export default function Report() {
  const [formState, setFormState] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    totalIncomeAmount: "",
    totalExpenseAmount: "",
    total: 0,
  });

  const handleDateChange = (date, field) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [field]: date,
    }));
    handleGetExpenseData();
    handleGetIncomeData();
  };

  const handleGetIncomeData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Income/getAllIncomeBetweenDates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromDate: formState.fromDate,
            toDate: formState.toDate,
          }),
        }
      );
      const data = await response.json();
      const totalIncome = data.data.totalIncomeAmount;

      if (!isNaN(totalIncome)) {
        setFormState((prevFormState) => ({
          ...prevFormState,
          totalIncomeAmount: totalIncome,
        }));
      } else {
        setFormState((prevFormState) => ({
          ...prevFormState,
          totalIncomeAmount: "",
        }));
      }
    } catch (error) {
      console.error("Error during fetching income data:", error);
    }
  }, [formState.fromDate, formState.toDate]);

  const handleGetExpenseData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Expense/getAllExpenseBetweenDates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromDate: formState.fromDate,
            toDate: formState.toDate,
          }),
        }
      );
      const data = await response.json();
      const totalExpense = data.data.totalExpenseAmount;

      if (!isNaN(totalExpense)) {
        setFormState((prevFormState) => ({
          ...prevFormState,
          totalExpenseAmount: totalExpense,
        }));
      } else {
        setFormState((prevFormState) => ({
          ...prevFormState,
          totalExpenseAmount: "",
        }));
      }
    } catch (error) {
      console.error("Error during fetching expense data:", error);
    }
  }, [formState.fromDate, formState.toDate]);

  useEffect(() => {
    handleGetExpenseData();
    handleGetIncomeData();
  }, [handleGetIncomeData, handleGetExpenseData]);

  // Update total whenever totalIncomeAmount or totalExpenseAmount changes
  useEffect(() => {
    const income = parseFloat(formState.totalIncomeAmount) || 0;
    const expense = parseFloat(formState.totalExpenseAmount) || 0;

    setFormState((prevFormState) => ({
      ...prevFormState,
      total: income - expense,
    }));
  }, [formState.totalIncomeAmount, formState.totalExpenseAmount]);

  return (
    <div>
      <Suspense fallback={<CSpinner color="primary" />}>
        <PDF formState={formState} />
      </Suspense>
      <div>
        <div className="report-style">
          <div className="modal-header">
            <div className="modal-body">
              <form>
                <div className="container">
                  <div className="row justify-content-around">
                    <div className="col-md-3 col-4">
                      <label htmlFor="fromDate" className="form-label">
                        From Date
                      </label>
                      <DatePicker
                        id="fromDate"
                        name="fromDate"
                        className="form-control mt-2 input-bgColor"
                        selected={formState.fromDate}
                        onChange={(date) => handleDateChange(date, "fromDate")}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div className="col-md-3 col-4">
                      <label htmlFor="toDate" className="form-label">
                        To Date
                      </label>
                      <DatePicker
                        id="toDate"
                        name="toDate"
                        className="form-control"
                        minDate={formState.fromDate}
                        selected={formState.toDate}
                        onChange={(date) => handleDateChange(date, "toDate")}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>
                </div>
                <table className="row justify-content-around mt-5">
                  <tbody>
                    <tr className="d-flex justify-content-center">
                      <td className="col-md-2">Total Income </td>
                      <td className="col-md-2"> : </td>
                      <td className="col-md-1">
                        <div className="totalAmount">
                          {formState.totalIncomeAmount}
                        </div>
                      </td>
                    </tr>
                    <tr className="d-flex justify-content-center">
                      <td className="col-md-2">Total Expense </td>
                      <td className="col-md-2"> : </td>
                      <td className="col-md-1">
                        <div className="totalAmount">
                          {formState.totalExpenseAmount}
                        </div>
                      </td>
                    </tr>
                    <tr className="d-flex justify-content-center mt-3">
                      <td className="col-md-2">Total </td>
                      <td className="col-md-2"> : </td>
                      <td className="col-md-1">
                        <div className="totalAmount">{formState.total}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
