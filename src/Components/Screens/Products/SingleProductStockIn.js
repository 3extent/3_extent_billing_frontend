import React, { useEffect, useState,useRef } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import CustomBarcodePrintComponent from '../../CustomComponents/CustomBarcodePrintComponent/CustomBarcodePrintComponent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS, STATUS_OPTIONS, } from './Constants';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';

function SingleProductStockIn() {
  const [modelOptions, setModelOptions] = useState([]);
  const [loading, setLoading] = useState(false)
  const [supplierNameOptions, setSupplierNameOPtions] = useState([]);
  const [productData, setProductData] = useState({
    model_name: '',
    imei_number: '',
    sales_price: '',
    purchase_price: '',
    grade: '',
    enginner_name: '',
    accessories: '',
    supplier_name: '',
    qc_remark: '',
    status: ''
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };
  const handleModelProductData = (value) => {
    setProductData(productData => ({ ...productData, model_name: value }));
  };
  const stockInCallback = (response) => {
    // printBarcode({ modelName: productData.model, grade: productData.grade, imei: productData.imei_number })
    if (response.status === 200) {
      setProductData({
        model_name: '',
        grade: '',
        purchase_price: '',
        sales_price: '',
        imei_number: '',
        enginner_name: '',
        qc_remark: '',
        supplier_name: '',
        accessories: '',
        status: ''
      });
    } else {
      console.log("error")
    }
  };
  useEffect(() => {
    getModelsAllData();
    getSupplierAllData();
  }, []);

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
    } else {
      console.log("Error");
    }
  }
  const addProductStockIn = () => {
    handlePrint({ modelName: productData.model_name, grade: productData.grade, imei_number: productData.imei_number })
    console.log('productData: ', productData);
    apiCall({
      method: "POST",
      url: "https://3-extent-billing-backend.vercel.app/api/products",
      data: productData,
      callback: stockInCallback,
      setLoading: setLoading
    });
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
            padding: 0px 5px;
            height: 100vh;
            width: 100vw;
          }
          #barcode-wrapper {
            position: absolute;
            top: 5%;
            width: 100%;
            text-align: center;
            font-family: sans-serif;
          }
          h1 {
            margin: 5px 0px;
            font-size: 100px;
            text-align: center;
            font-weight: bolder;
          }
          h2 {
            margin: 0;
            font-size: 85px;
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
          <h1>3_EXTENT</h1>
          <h2>${product.modelName}</h2>
          <h2>Grade : ${product.grade}</h2>
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
            fontSize: 25
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

  const getSupplierCallBack = (response) => {
    console.log('response: ', response);
    if (response.status === 200) {
      const suppliers = response.data.map(Supplier => Supplier.name);
      setSupplierNameOPtions(suppliers);
    } else {
      console.log("Error");
    }
  }

  const getSupplierAllData = () => {
    let url = "https://3-extent-billing-backend.vercel.app/api/users?role=SUPPLIER";
    apiCall({
      method: 'GET',
      url: url,
      data: {},
      callback: getSupplierCallBack,
    })
  }
  
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-2">
      {loading && <Spinner />}
      <CustomDropdownInputComponent
        name="Model Name"
        dropdownClassName="w-[80%]"
        placeholder="Enter Model Name"
        value={productData.model_name}
        onChange={handleModelProductData}
        options={modelOptions}
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
        type="text"
        name="purchase_price"
        placeholder="Buying Purchase Price"
        value={productData.purchase_price}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Sales Price"
        type="text"
        name="sales_price"
        placeholder="Rate Selling Price"
        value={productData.sales_price}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="IMEI"
        type="text"
        name="imei_number"
        placeholder="IMEI"
        value={productData.imei_number}
        maxLength={15}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="Enginner Name "
        type="text"
        name="enginner_name"
        placeholder="Enginner Name"
        value={productData.enginner_name}
        onChange={handleInputChange}
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
      />
      <InputComponent
        label="QC Remark"
        type="text"
        name="qc_remark"
        placeholder="QC Remark"
        inputClassName="w-[80%]"
        labelClassName="font-serif font-bold"
        value={productData.qc_remark}
        onChange={handleInputChange}
      />
      <DropdownCompoent
        label="Supplier"
        name="supplier_name"
        options={supplierNameOptions}
        placeholder="Select Supplier"
        value={productData.supplier_name}
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
      <DropdownCompoent
        label="Status"
        name="status"
        placeholder="Select status"
        value={productData.status}
        onChange={handleInputChange}
        options={STATUS_OPTIONS}
        className="w-[80%] "
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
