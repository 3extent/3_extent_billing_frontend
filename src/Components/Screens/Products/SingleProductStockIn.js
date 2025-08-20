import React, { useEffect, useState, useRef } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS, SUPPLIER_OPTIONS } from './Constants';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { apiCall } from '../../../Util/AxiosUtils';
import Barcode from 'react-barcode';
import JsBarcode from 'jsbarcode';


function SingleProductStockIn() {
  const barcodeRef = useRef();
  const printAreaRef = useRef();
  const [modelOptions, setModelOptions] = useState([]);
  const [modelName, setModelName] = useState("");
  const [productData, setProductData] = useState({
    model: '',
    imei_number: '',
    sales_price: '',
    purchase_price: '',
    grade: '',
    engineer_name: '',
    accessories: '',
    supplier: '',
    qcRemark: '',
    createdAt: '',
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };
  // const stockInCallback = (response) => {
  //     printBarcode({ modelName: productData.model, grade: productData.grade, imei: productData.imei_number })
  //     if (response.status === 200) {
  //         setProductData({
  //             model: '',
  //             createdAt: '',
  //             grade: '',
  //             purchase_price: '',
  //             sales_price: '',
  //             imei_number: '',
  //             engineer_name: '',
  //             qcRemark: '',
  //             supplier: '',
  //             accessories: '',
  //         });
  //     } else {
  //         console.log("error")
  //     }
  // };


  useEffect(() => {
    getModelsAllData();
  }, []);

  useEffect(() => {
    if (productData.imei_number && barcodeRef.current) {
      JsBarcode(barcodeRef.current, productData.imei_number, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,           // Narrower bars for compact layout
        height: 100,         // Shorter height to fit within page bounds
        displayValue: true, // Shows the IMEI below the barcode
        fontSize: 14,       // Adjust font size for readability
        margin: 10,         // Adds padding around the barcode
      });
    }
  }, [productData.imei_number]);

  const getModelsAllData = () => {
    let url = "https://3-extent-billing-backend.vercel.app/api/models";
    apiCall({
      method: 'GET',
      url: url,
      data: {},
      callback: getModelsCallBack,
    })
  }
  const getModelsCallBack = (response) => {
    console.log('response: ', response);
    if (response.status === 200) {
      const models = response.data.map(model => model.name);
      setModelOptions(models);
      console.log('models: ', models);
      if (!modelName) {
        setModelName("");
      }
    } else {
      console.log("Error");
    }
  }
  const addProductStockIn = () => {
    handlePrint({ modelName: modelName, grade: productData.grade, imei_number: productData.imei_number })
    // apiCall({
    //     method: "POST",
    //     url: "https://3-extent-billing-backend.vercel.app/api/products",
    //     data: { products: [productData] },
    //     callback: stockInCallback
    // });
  }

  const handlePrint = (product) => {
    const win = window.open('', '', 'height=800,width=600');
    win.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          #barcode-wrapper {
            position: absolute;
            top: 20%;
            width: 100%;
            text-align: center;
            font-family: sans-serif;
          }
          h1 {
            margin: 0px 20px;
            font-size: 115px;
            text-align: left;
            font-weight: bolder;
          }
          svg {
            width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div id="barcode-wrapper">
          <h1>${product.modelName}</h1>
          <h1>Grade : ${product.grade}</h1>
          <svg id="barcode"></svg>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          JsBarcode("#barcode", "${product.imei_number}", {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 50,
            displayValue: true,
            fontSize: 50
          });
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
    win.document.close();
    win.focus();
  };


  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-2">
      <CustomDropdownInputComponent
        name="Model Name"
        dropdownClassName="w-[80%]"
        placeholder="Enter Model Name"
        value={modelName}
        onChange={(value) => setModelName(value)}
        options={modelOptions}
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Date"
        type="date"
        name="createdAt"
        placeholder="Enter your Date"
        value={productData.createdAt}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <DropdownCompoent
        label="Grade"
        name="grade"
        options={GRADE_OPTIONS}
        placeholder="Select Grade"
        value={productData.grade}
        onChange={handleInputChange}
        className="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Purchase Price"
        type="number"
        name="purchase_price"
        placeholder="Buying Purchase Price"
        value={productData.purchase_price}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Sales Price"
        type="number"
        name="sales_price"
        placeholder="Rate Selling Price"
        value={productData.sales_price}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="IMEI"
        type="number"
        name="imei_number"
        placeholder="IMEI"
        value={productData.imei_number}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Engineer Name"
        type="text"
        name="engineer_name"
        placeholder="Engineer Name"
        value={productData.engineer_name}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="QC Remark"
        type="text"
        name="qcRemark"
        placeholder="QC Remark"
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
        value={productData.qcRemark}
        onChange={handleInputChange}
      />
      <DropdownCompoent
        label="Supplier"
        name="supplier"
        options={SUPPLIER_OPTIONS}
        placeholder="Select Supplier"
        value={productData.supplier}
        onChange={handleInputChange}
        className="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <DropdownCompoent
        label="Accessories"
        name="accessories"
        options={ACCESSORIES_OPTIONS}
        placeholder="Select Box"
        value={productData.accessories}
        onChange={handleInputChange}
        className="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <div className="col-span-2 mt-4 flex justify-center">
        <PrimaryButtonComponent
          label="Save"
          icon="fa fa-save"
          buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
          onClick={addProductStockIn}

        />
      </div>
    </div>
  );
}
export default SingleProductStockIn;
