import React, { useEffect, useState, useRef } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS, STATUS_OPTIONS, } from './Constants';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
import { handleBarcodePrint } from '../../../Util/Utility';
import { useNavigate, useParams } from 'react-router-dom';
function SingleProductStockIn() {
  const [modelOptions, setModelOptions] = useState([]);
  const [loading, setLoading] = useState(false)
  const [supplierNameOptions, setSupplierNameOPtions] = useState([]);
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    model_name: '',
    imei_number: '',
    sales_price: '',
    purchase_price: '',
    grade: '',
    engineer_name: '',
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
    if (response.status === 200) {
      setProductData({
        model_name: '',
        grade: '',
        purchase_price: '',
        sales_price: '',
        imei_number: '',
        engineer_name: '',
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
  useEffect(() => {
  if (product_id) {
    getProductData();
  }
}, [product_id]);
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
  const deleteCallback=(response)=>{
    if (response.status === 200) {
        // seterror("Product deleted successfully.");
        navigate("/products");
      } else {
        // seterror("Failed to delete product.");
      }
  }
  const deleteProduct = () => {
    apiCall({
      method: "DELETE",
      url: `https://3-extent-billing-backend.vercel.app/api/products/${product_id}`,
      data: {},
      callback: deleteCallback,
      setLoading: setLoading
    })
  }
  const saveProductStockIn = () => {
    handleBarcodePrint({ modelName: productData.model_name, grade: productData.grade, imei_number: productData.imei_number })
    console.log('productData: ', productData);
    if (product_id) {
      editProductData();
    } else {
      addProductData();
    }
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
  const saveProductCallback = (response) => {
    if (response.status === 200) {
      navigate("/products");
    } else {
      // setError("Error occurred while saving customer");
    }
  };
  const addProductData = () => {
    apiCall({
      method: "POST",
      url: "https://3-extent-billing-backend.vercel.app/api/products",
      data: productData,
      callback: stockInCallback,
      setLoading: setLoading
    });
  }
  const editProductData = () => {
    apiCall({
      method: "PUT",
      url: `https://3-extent-billing-backend.vercel.app/api/products/${product_id}`,
      data: productData,
      callback: saveProductCallback,
      setLoading: setLoading,
    });
  }
  const getProductCallback = (response) => {
    if (response.status === 200) {
      setProductData({
        model_name: response.data.model.name, imei_number: response.data.imei_number,
        sales_price: response.data.sales_price, purchase_price: response.data.purchase_price,
        grade: response.data.grade, engineer_name: response.data.engineer_name, accessories: response.data.accessories,
        supplier_name: response.data.supplier.name, qc_remark: response.data.qc_remark, status: response.data.status
      });
    } else {
      console.log("Failed to fetch product data.");
    }
  };
  const getProductData = () => {
    apiCall({
      method: 'GET',
      url: `https://3-extent-billing-backend.vercel.app/api/products/${product_id}`,
      data: {},
      callback: getProductCallback,
      setLoading: setLoading,
    });
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
        name="engineer_name"
        placeholder="Enginner Name"
        value={productData.engineer_name}
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
      <div className="col-span-2 mt-4 flex justify-center gap-4">
        <PrimaryButtonComponent
          label="Save"
          icon="fa fa-save"
          buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
          onClick={saveProductStockIn}
        />
        {product_id && (
          <PrimaryButtonComponent
            label="Delete"
            icon="fa fa-trash"
            buttonClassName="mt-2 py-1 px-3 text-xl border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white"
            onClick={deleteProduct}
          />
        )}
      </div>
    </div>
  );
}
export default SingleProductStockIn;
