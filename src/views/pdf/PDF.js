import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function PDF({ formState }) {
  const data1 =
    "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";
  const data2 =
    " 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";

  const documentDefinition = {
    content: [
      {
        image: `data:image/jpeg;base64,${data1}`,
        width: 575,
        margin: [-30, -30, 0, 0],
      },
      {
        image: `data:image/jpeg;base64,${data2}`,
        width: 140,
        absolutePosition: { x: 20, y: 62 },
      },
      { text: "Report", style: "header" },
      {
        style: "rowDate",
        columns: [
          {
            alignment: "justify",
            style: "formDate",
            text: [
              "Form Date",
              "     :     ",
              `${formState.fromDate.toISOString().slice(0, 10)}`,
            ],
          },
          {
            alignment: "justify",
            style: "toDate",
            text: [
              "To Date",
              "     :     ",
              `${formState.toDate.toISOString().slice(0, 10)}`,
            ],
          },
        ],
      },

      {
        style: "table",
        table: {
          widths: [200, 355],
          heights: [25, 25, 25],
          body: [
            ["Total Income", `${formState.totalIncomeAmount}`],
            ["Total Expense", `${formState.totalExpenseAmount}`],
            [
              { text: "Total", style: "total" },
              { text: `${formState.total}`, style: "total" },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        alignment: "center",
        bold: true,
        margin: [0, 30, 0, 0],
      },
      total: {
        bold: true,
      },
      table: {
        fontSize: 14,
        margin: [-30, 0, 0, 0],
      },
      rowDate: {
        fontSize: 14,
        margin: [0, 80, 0, 29],
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };
  const createPdf = () => {
    pdfMake.createPdf(documentDefinition).download();
    console.log(documentDefinition);
  };

  return (
    <>
      <div>
        <div className="text-center mt-5">
          <button className="btn btn-primary" onClick={createPdf}>
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default PDF;
