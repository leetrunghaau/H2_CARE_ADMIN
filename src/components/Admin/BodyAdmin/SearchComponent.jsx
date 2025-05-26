// SearchComponent.js
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { Form, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../redux/app/appSlice';

const { Search } = Input;

const SearchComponent = ({ onSearch, placeholder }) => {

    const [searchValue, setSearchValue] = useState('');
    let searchTimeout; // Định nghĩa biến bên ngoài

    
    const dispatch = useDispatch()

    const handleSearchChange = (value) => {
        setSearchValue(value);
        
        // Hủy timeout trước đó nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Tạo timeout mới
        searchTimeout = setTimeout(() => {
            onSearch(value); // Gọi hàm tìm kiếm
        }, 300); // Độ trễ 300ms
    };


    return (
        <>            
            <Search
                style={{height: "50px"}}
                placeholder={placeholder} 
                onSearch={onSearch} 
                enterButton 
                onChange={(e) => handleSearchChange(e.target.value)} // Gọi hàm xử lý thay đổi
            />
            {/* <Navbar.Collapse className="justify-content-end">
                <Form.Check // prettier-ignore
                    type="switch"
                    value={mode}
                    defaultChecked={mode === 'light' ? false : true}
                    onChange={(e) => {
                        console.log(">> check mode: ", e.target.checked);                            
                        dispatch(changeMode(e.target.checked === true ? 'dark' : 'light'))
                    }} 
                    id="custom-switch"
                    label={mode === 'light' ? <Navbar.Text>Light mode</Navbar.Text> : <Navbar.Text>dark mode</Navbar.Text>}
                />                    
            </Navbar.Collapse> */}
        </>
    );
};

export default SearchComponent;
