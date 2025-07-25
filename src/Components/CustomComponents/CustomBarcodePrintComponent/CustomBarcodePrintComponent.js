import Barcode from "react-barcode";

function CustomBarcodePrintComponent({ modelName, grade, imei }) {
  return (
    <div className="font-serif text-center p-5 bg-white">
      <div className="text-2xl font-semibold text-gray-800">
        {modelName}
      </div>
      <div className="text-lg text-gray-600 ">
        <strong>Grade:</strong> {grade}
      </div>
      <div>
        <Barcode value={imei} />
      </div>
    </div>
  );
}

export default CustomBarcodePrintComponent;
