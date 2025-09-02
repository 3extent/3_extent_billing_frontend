import React, { useEffect, useState } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import CustomBarcodePrintComponent from '../../CustomComponents/CustomBarcodePrintComponent/CustomBarcodePrintComponent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS, SUPPLIER_OPTIONS } from './Constants';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
function SingleProductStockIn() {
    const [modelOptions, setModelOptions] = useState([]);
    const[loading,setLoading]=useState(false)
    const [supplierNameOptions,setSupplierNameOPtions]=useState([]);
    const [productData, setProductData] = useState({
        model_name: '',
        imei_number: '',
        sales_price: '',
        purchase_price: '',
        grade: '',
        enginner_name: '',
        accessories: '',
        supplier_name: '',
        qc_remark: ''
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
        // printBarcode([{ model_name: productData.model_name, grade: productData.grade, imei: productData.imei_number }])
        console.log('productData: ', productData);
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/products",
            data: productData,
            callback: stockInCallback,
            setLoading:setLoading
        });
    }
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
    const printBarcode = (barcodeList) => {
        console.log('barcodeList: ', barcodeList);
        const printWindow = window.open('', '', 'width=600,height=800');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups for this site.');
            return;
        }
        const barcodeHTML = barcodeList
            .map(
                (code) => `<div style="page-break-after: always; text-align: left; margin-top: 100px;font-style:bold;width:50%">
                            <div style="margin-top: 10px; font-size: 18px;text-align: left;">Model : ${code.modelName}</div>
                            <div style="margin-top: 10px; font-size: 18px;text-align: left;">Grade : ${code.grade}</div>
                            <svg id="barcode"></svg>
                           </div>`
            )
            .join('');
        printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${barcodeHTML}
          <script>
            window.onload = function() {
              JsBarcode("#barcode", "${barcodeList[0].imei}", {
                format: "CODE128",
                width: 3,
                height: 50,
                displayValue: true
              });
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `);

        printWindow.document.close();
    };
    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            {loading && <Spinner/>}
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