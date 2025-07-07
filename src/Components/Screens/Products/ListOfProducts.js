
import React, { useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';

function ListOfProducts() {
    return (
        <div>
            <h2>List Of Products</h2>

            <div className='mb-10 w-[50%]'>
                <InputComponent
                    label="Date:"
                    type="Date"
                    placeholder="Enter your Date"
                />
                <InputComponent
                    label="Brand:"
                    type="text"
                    placeholder="Enter your Brand"
                />
                <InputComponent
                    label="Model:"
                    type="text"
                    placeholder="Enter your Model"
                />
                <InputComponent
                    label="Grade:"
                    type="text"
                    placeholder="Enter your Grade"
                />

            </div>



        </div>
    );
}

export default ListOfProducts;
