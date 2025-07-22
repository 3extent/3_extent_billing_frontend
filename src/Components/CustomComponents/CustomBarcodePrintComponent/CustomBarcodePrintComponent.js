
import React from "react";
import Barcode from "react-barcode";

function CustomBarcodePrintComponent({ modelName, grade, imei }) {
  return (
    <div className="printable-area hidden print:block mx-auto text-center">
      <div className="font-serif text-xl  font-semibold text-gray-800">
        {modelName}
      </div>
      <div className="text-gray-700  text-lg">
        <strong>Grade:</strong> {grade}
      </div>
      <div className="flex justify-center">
        <Barcode value={imei}
        />
      </div>
    </div>
  );
}

export default CustomBarcodePrintComponent;
