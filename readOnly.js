"use client"
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Container, Paper, Button, Typography, FormControl, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import IconRight from '@mui/icons-material/ArrowBackIosRounded';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Chip from '@mui/material/Chip';
import LoadingButton from '@mui/lab/LoadingButton';
import { KeyboardArrowRight } from '@mui/icons-material';
import Swal from 'sweetalert2'

// API
import { add_member_to_cart } from "@/api_calls/lab/add_member_to_cart";
import { get_cart_member } from "@/api_calls/lab/get_cart_member";
import { delete_member_from_cart } from "@/api_calls/lab/delete_member_from_cart";
import { get_app_thyrocare_slot } from "@/api_calls/lab/get_app_thyrocare_slot";
import { get_cart_total } from "@/api_calls/lab/get_cart_total";
import { delete_member_cart } from "@/api_calls/lab/delete_member_cart";
import { add_to_cart } from "@/api_calls/lab/add_to_cart";
import { process_booking } from "@/api_calls/lab/process_booking";
import { get_dr_lal_cities } from "@/api_calls/lab/get_dr_lal_cities";
import { get_dr_lal_localities } from "@/api_calls/lab/get_dr_lal_localities";
import { get_india_pincode_lat_long } from "@/api_calls/lab/get_india_pincode_lat_long";
import { GetPharmacyAddress } from '@/api_calls/pharmacy/GetPharmacyAddress';
import { GetPharmacyStates } from '@/api_calls/pharmacy/GetPharmacyStates';
import { GetPharmacyCities } from '@/api_calls/pharmacy/GetPharmacyCities';
import { AddAddress, DeleteAddress } from '@/api_calls/pharmacy/AddAddress';

const getRndInteger = () => {
    const min = 100000; const max = 999999;
    return Math.floor(Math.random() * (max - min)) + min;
}

export default () => {
    const router = useRouter();
    const [skeleton, setSkeleton] = useState(1);
    const [user, setUser] = useState("");
    const [slots, setSlots] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [clickedBooking, setClickedBooking] = useState(0);
    const [lalLocalityId, setLalLocalityId] = useState(0);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [fullName, setFullName] = useState("");
    const [mobNumb, setMobNumb] = useState("");
    const [defaultEmail, setDefaultEmail] = useState("");
    const [defaultPincode, setDefaultPincode] = useState("");
    const [defaultAddress, setDefaultAddress] = useState("");
    const [age, setAge] = useState("37");

    const [expandAccordian, setExpandAccordian] = useState(false);
    const [userAddress, setUserAddress] = useState([]);
    const [states, setStates] = useState([]);
    const [curIndex, setCurIndex] = useState(null);

    const [addressId, setAddressId] = useState("");
    const [email, setEmail] = useState("");
    const [houseAddress, setHouseAddress] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");
    const [addressState, setAddressState] = useState("");
    const [addressCity, setAddressCity] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [newAddressDrawer, setNewAddressDrawer] = useState(false);

    const FamilySelect = ({ value, onChange }) => {
        return (
            <FormControl variant="filled" fullWidth size="small">
                <InputLabel id="family-label">Book For</InputLabel>
                <Select
                    labelId="family-label"
                    id="family"
                    value={value}
                    label="Book For"
                    onChange={onChange}
                >
                    <MenuItem value="self">Self</MenuItem>
                    <MenuItem value="spouse">Spouse</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                    <MenuItem value="sibling">Sibling</MenuItem>
                    <MenuItem value="grandparent">Grandparent</MenuItem>
                    <MenuItem value="grandchild">Grandchild</MenuItem>
                    <MenuItem value="aunt">Aunt</MenuItem>
                    <MenuItem value="uncle">Uncle</MenuItem>
                    <MenuItem value="cousin">Cousin</MenuItem>
                    <MenuItem value="niece">Niece</MenuItem>
                    <MenuItem value="nephew">Nephew</MenuItem>
                    <MenuItem value="in-law">In-law</MenuItem>
                </Select>
            </FormControl>
        );
    };

    const [family, setFamily] = useState('self');

    const handleFamilyChange = (event) => {
        setFamily(event.target.value);
    };

    const GenderSelect = ({ value, onChange }) => {
        return (
            <FormControl variant="filled" fullWidth size="small">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                    labelId="gender-label"
                    id="gender"
                    value={value}
                    label="Gender"
                    onChange={onChange}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>
        );
    };

    const [gender, setGender] = useState('');

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };
    const [cities, setCities] = useState([]);
    const [localities, setLocalities] = useState([]);

    const [testsAdded, setTestAdded] = useState([]);

    const removeFromCart = async (package_id, user_id) => {
        const cart = await add_to_cart(package_id, user_id, 'Remove');
        if (cart.status == 1) {
            const lab_cart = JSON.parse(localStorage.getItem('lab_cart'));
            const totalPkgs = lab_cart[0].packages;
            if (totalPkgs.length == 1) {
                localStorage.removeItem("lab_cart");
            } else {
                const cartData = { lab_id: lab_cart.lab_id, ...cart.data };
                localStorage.setItem("lab_cart", JSON.stringify(cartData));
            }
        }
    }
    const removeTest = async (test_id) => {
        const removeTest = testsAdded.filter(m => m.test_id != test_id);
        setTestAdded(removeTest);

        const package_id = test_id;

        // remove from db
        await delete_member_cart(user.temp_user_id, package_id);
        getCartTotal(user.temp_user_id);

        // remove from local / cart
        removeFromCart(package_id, user.temp_user_id);

        // redirect if no more tests available in cart  
        if (removeTest.length == 0) {
            router.push("/lab");
        }
    }

    const [members, setMembers] = useState([]);

    const [cartTotal, setCartTotal] = useState({
        total_amount: "&#8377; 0",
        total_discount: "&#8377; 0",
        total_mrp: "&#8377; 0"
    });

    const getCoords = async (user_pincode) => {
        const latLong = await get_india_pincode_lat_long(user_pincode);

        if (latLong.status) {
            setLatitude(latLong.data.lat);
            setLongitude(latLong.data.lng);
        }

    }
    const getSlots = async (appintment_date, user_pincode) => {
        let day = appintment_date;
        // let day = new Date(appintment_date);
        // const getMonth = day.getMonth() + 1;
        // day = day.getFullYear() + "-" + (getMonth < 10 ? "0" + getMonth : getMonth) + "-" + (day.getDate() < 10 ? "0" + day.getDate() : day.getDate());
        //all_test = document.write(testsAdded.toString());
        if (day && user_pincode) {
            const lab_cart = JSON.parse(localStorage.getItem("lab_cart"));
            const lab_id = lab_cart.lab_id;
            const testId = testsAdded[0].test_id;
            const api_slots = await get_app_thyrocare_slot(user_pincode, day, lab_id, lalLocalityId, testId, latitude, longitude);
            if (api_slots.data.status == 200) {
                const slotArray = api_slots.data.data;
                setSlots(slotArray);
            }
            else if (api_slots.data.status == 400) {
                setSlots([]);
            }
        }

    }
    const getCartTotal = async (temp_user_id) => {
        const cartTotal = await get_cart_total(temp_user_id);
        if (cartTotal.status == 1) {
            setCartTotal(cartTotal.data);
        }
    }
    const getPackageDetails = async (temp_user_id) => {
        const members = await get_cart_member(temp_user_id);
        if (members.status == 1) {
            if (members.data[0].length > 0) {
                const packages = members.data[0][0].packages;
                const pkgArr = [];
                packages.map(e => {
                    const obj = {
                        test_id: e.package_id,
                        name: e.package_name,
                        brand: e.lab_name,
                        mrp: e.package_price,
                        price: e.package_price,
                    };
                    pkgArr.push(obj);
                });
                setTestAdded(pkgArr);
                getCartTotal(temp_user_id);
            }
        }
    }
    const addMoreMember = async (temp_user_id = "") => {
        let uid = user.temp_user_id;
        if (temp_user_id != "") {
            uid = temp_user_id;
        }
        const member = await add_member_to_cart(uid);
        if (member.status == 1) {
            const newMember = {
                "member_id": member.data.member_id,
                "member_name": "",
                "member_age": "",
                "member_gender": ""
            };
            setMembers([...members, newMember]);
            getCartTotal(uid);
        }
    }
    const getCartMember = async (temp_user_id = "") => {
        let uid = user.temp_user_id;
        if (temp_user_id != "") {
            uid = temp_user_id;
        }
        const members = await get_cart_member(uid);
        if (members.status == 1) {
            if (members.data[0].length > 0) {
                const memArray = [];
                members.data[0].map(e => {
                    const obj = {
                        "member_id": e.member_id,
                        "member_name": "",
                        "member_age": "",
                        "member_gender": ""
                    };
                    memArray.push(obj);
                });
                setMembers(memArray);
            } else {
                addMoreMember(uid);
            }
        }
        getPackageDetails(uid);
    }
    const removeMember = async (member_id) => {
        const removeMember = members.filter(m => m.member_id != member_id);
        setMembers(removeMember);
        await delete_member_from_cart(user.temp_user_id, member_id);
        getCartTotal(user.temp_user_id);
    }
    const getMemberVal = (e, key, member_id) => {
        let filterMember = members.filter(m => m.member_id == member_id);
        return filterMember[0][key];
    }
    const handleMemberChange = (e, key, member_id) => {
        let filterMember = members.filter(m => m.member_id == member_id);
        filterMember = filterMember[0];
        filterMember[key] = e.target.value;
        setMembers(prev => prev.map(e => {
            if (e.member_id === member_id) {
                return {
                    ...e,
                    filterMember
                }
            }
            return e;
        }));
    }
    const getCities = async () => {
        const cityData = await get_dr_lal_cities();
        if (cityData.status == 1) {
            setCities(cityData.data.map(item => ({
                id: `${item.lab_city_id}`,
                name: `${item.city_name}`,
            })));
        } else {
            const msg = cityData.msg;
        }
    }
    const getLocalities = async (cityId) => {
        setLocalities([]);
        const localityData = await get_dr_lal_localities(cityId);
        if (localityData.status == 1) {
            setLocalities(localityData.data.map(item => ({
                id: `${item.lab_locality_id}`,
                name: `${item.locality}`,
            })));
        } else {
            const msg = localityData.msg;
        }
    }






    useEffect(() => {
        async function check() {
            await GetPharmacyAddress().then(res => {
                if (false) {
                }
                else {
                    setUserAddress(res.addresses.map(item => ({
                        ecom_address_id: `${item.ecom_address_id}`,
                        house_address: `${item.house_address}`,
                        street_address: `${item.street_address}`,
                        landmark: `${item.landmark}`,
                        country: 'India',
                        state: `${item.state}`,
                        city: `${item.city}`,
                        pincode: `${item.pincode}`,
                        status: `${item.status}`,
                        name: `${item.name}`,
                        phone: `${item.phone}`,
                        email: `${item.email}`,
                    })));

                }
            }).catch((error) => {
                console.log(error);
                //return { status: 0, msg: error.message };
            });

            await GetPharmacyStates().then(res => {
                if (false) {
                }
                else {
                    setStates(res.map(item => ({
                        id: `${item.Value}`,
                        state: `${item.Text}`,
                    })));
                }
            }).catch((error) => {
                console.log(error);
                //return { status: 0, msg: error.message };
            });
        }
        check();
        const application_user = JSON.parse(localStorage.getItem("application_user"));
        console.log(application_user);
        setUser(application_user);
        getCartMember(application_user.temp_user_id);
        getCities();
        setFullName(application_user.user_name);
        setMobNumb(application_user.temp_user_mobile);
        setDefaultEmail(application_user.user_email);
        setAge(application_user.user_age);
        setDefaultAddress(application_user.user_address);
        setDefaultPincode(application_user.user_pincode);
        setGender(application_user.user_gender);

        setSkeleton(0);
    }, []);

    const bookSubmit = async () => {
        setClickedBooking(1);

        if (!age || !gender) {
            // Display an error message or handle it as per your requirements
            console.error("Please fill in the Age and Gender fields.");
            setClickedBooking(0);
            return;
        }

        
        const lab_cart = JSON.parse(localStorage.getItem("lab_cart"));
        let appintment_date = user.appintment_date;
        // let appintment_date = new Date(user.appintment_date);
        // const getMonth = appintment_date.getMonth() + 1;
        // appintment_date = appintment_date.getFullYear() + "-" + (getMonth < 10 ? "0" + getMonth : getMonth) + "-" + (appintment_date.getDate() < 10 ? "0" + appintment_date.getDate() : appintment_date.getDate());

        const obj = {
            temp_user_id: user.temp_user_id,
            lab_id: lab_cart.lab_id,
            lead_from: "Mobile App",
            name: user.user_name,
            phelbo_price: cartTotal.total_amount.replace("&#8377; ", ""),
            user_id: user.temp_user_id,
            mobile: user.temp_user_mobile,
            otp: "",
            email: user.user_email,
            name: user.user_name,
            age: age,
            gender: gender,
            pincode: user.user_pincode,
            address: user.user_address,
            lal_city: "",
            lal_locality: "",
            Latitude: latitude,
            Longitude: longitude,
            booking_date: appintment_date,
            slot_id: user.appintment_slot,
            lalLocalityId: user.lalLocalityId,
            relation: family
        }
        const memObj = [];
        members.map(e => {
            memObj.push({
                "member_id": e.member_id,
                "member_name": e.member_name,
                "member_age": e.member_age,
                "member_gender": e.member_gender,
            });
        });
        let testObj = [];
        testsAdded.map(e => {
            testObj.push(e.test_id);
        });
        let mergedObj = { ...obj, members: memObj, mem_packages: testObj };

        // Display the key/value pairs
        // for (var pair of booked.data.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        // console.log(booked);
        //console.log(mergedObj);
        //return;

        const booked = await process_booking(mergedObj);
        if (booked.status == 1) {
            if (booked.data.order_id && booked.data.order_id != "") {
                localStorage.removeItem("lab_cart");
                router.push("/thankyou/lab?order_id=" + booked.data.order_id);
                //setErrMsg(booked.data.msg);
            } else {
                setClickedBooking(0);
            }
        } else {
            setClickedBooking(0);
        }
    }

    const toggleAddressDrawer = (open, index) => (event) => {

        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {

            return;
        }
        if (index >= 0) {

            setCurIndex(index)
            setAddressId(userAddress[index]?.ecom_address_id);
            setHouseAddress(userAddress[index]?.house_address);
            setStreetAddress(userAddress[index]?.street_address);
            setLandmark(userAddress[index]?.landmark);
            setPincode(userAddress[index]?.pincode);
            setAddressState(userAddress[index]?.state);
            downloadCities(userAddress[index]?.state);
            setAddressCity(userAddress[index]?.city);
            setStatus(userAddress[index]?.status ? status : "");
            setName(userAddress[index]?.name);
            setPhone(userAddress[index]?.phone);
            setEmail(userAddress[index]?.email);

        }
        if (open)
            setNewAddressDrawer(open);
        else {
            setAddressId("");
            setHouseAddress("");
            setStreetAddress("");
            setLandmark("");
            setPincode("");
            setAddressState("");
            setAddressCity("");
            setStatus("");
            setName("");
            setPhone("");
            setEmail("");
            setNewAddressDrawer(open);

        }

    };

    const selectAddressId = async (el) => {
        console.log(el.pincode);
        setAddressId(prev => el.ecom_address_id);
        setDefaultPincode(prev => el.pincode);
        setDefaultAddress(prev => el.name + ' ' + el.city + ' ' + el.house_address + ' ' + el.street_address + ' ' + el.landmark + ' ' + el.state + ' ' + el.city + ' ' + el.pincode + 'India, Phone number: ' + el.phone + ' email: ' + el.email);
        setExpandAccordian(false);
    }

    // Add Address Form Submit

    const addAddress = async () => {
        setNewAddressDrawer(false);

        const addAddressUpdateData = {
            name: name,
            ecom_address_id: addressId != "" ? addressId : null,
            phone: phone,
            email: email,
            house_address: houseAddress,
            street_address: streetAddress,
            landmark: landmark,
            state: addressState,
            city: addressCity,
            pincode: pincode,
            status: status,
            app_vendor_id: 0
        }
        //Make API call
        await AddAddress(addAddressUpdateData).then(res => {
            if (false) {
            }
            else {
                //console.log(res);
                // setUserAddress(userAddress[curIndex]=addAddressUpdateData);
                // router.push("/pharmacy/checkout");
                location.reload();
            }
        });

    }

    const fetchLocation = async (e) => {
        e.preventDefault();
        addressState && await GetPharmacyCities(addressState).then(res => {
            if (false) {
            }
            else {
                setCities(res.map(item => ({
                    id: `${item.Value}`,
                    city: `${item.Text}`,
                })));
            }
        });
        //console.log(addressCity);

    }

    const downloadCities = async (addressState) => {
        addressState && await GetPharmacyCities(addressState).then(res => {
            if (false) {
            }
            else {
                setCities(res.map(item => ({
                    id: `${item.Value}`,
                    city: `${item.Text}`,
                })));
            }
        });
    }

    // Delete Address

    const deleteAddress = async (event, id) => {
        event.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            showConfirmButton: false,
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`
        }).then((result) => {
            if (result.isDenied) {
                const newAddress = userAddress.filter(el => el.ecom_address_id != id);
                setUserAddress(newAddress);
                DeleteAddress(id); // deleting address from database in background.
            }
        });
        // if (confirm('Are you sure?')) {
        //     const newAddress = userAddress.filter(el => el.ecom_address_id != id);
        //     setUserAddress(newAddress);
        //     await DeleteAddress(id); // deleting address from database in background.
        // }
    }


    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999
                }}
            >
                <Paper square>
                    <Box className="d-flex" sx={{
                        justifyContent: "space-between",
                        p: 2
                    }}>
                        <Box className="d-flex">
                            <Box onClick={() => router.back()}>
                                <IconRight sx={{ mt: "5px", mr: 2 }} fontSize='15px' />
                            </Box>
                            <Typography variant='p' component="p" fontWeight={500}>
                                Booking Confirmation
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Box sx={{
                marginBottom: "70px"
            }}></Box>
            {
                skeleton == 1 ? showSkeleton() :
                    <>
                        <Container>
                            <Box>
                                <Typography variant='h6' fontSize="16px">
                                    Your Details
                                </Typography>
                            </Box>
                            <Box>
                                <FamilySelect sx={{ mt: 1.5 }} value={family} onChange={handleFamilyChange} />
                                <FormControl fullWidth sx={{ mt: 1.5 }}>
                                    <TextField size="small" type='text' value={fullName} fullWidth label="Full Name" readOnly variant="filled" onChange={(e) => setFullName(e.target.value)} />
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 1.5 }}>
                                    <TextField size="small" type='number' value={mobNumb} fullWidth readOnly label="Mobile Number" variant="filled" onChange={(e) => setMobNumb(e.target.value)} />
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 1.5 }}>
                                    <TextField size="small" type='email' value={defaultEmail} fullWidth label="Your Email" variant="filled" readOnly onChange={(e) => setEmail(e.target.value)} />
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 1.5 }}>
                                    <TextField size="small" type='number' required={true} value={age} fullWidth readOnly label="Age" variant="filled" onChange={(e) => setAge(e.target.value)} />
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 1.5 }}>
                                    <GenderSelect value={gender} required={true} onChange={handleGenderChange} />
                                </FormControl>
                            </Box>


                            {/* Address */}
                            <Accordion expanded={expandAccordian} onChange={() => setExpandAccordian(!expandAccordian)} sx={{ borderRadius: "10px", marginTop: expandAccordian ? "none" : "10px", }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        background: "var(--textgreen)",
                                        borderRadius: "10px"
                                    }}
                                >
                                    <Typography sx={{ color: "#fff" }} fontWeight={500} variant='subtitle1' component={'p'}>
                                        Select  Address
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Button fullWidth onClick={toggleAddressDrawer(true, null)} variant="text" sx={{ color: "#000" }}>
                                            + Add New Address
                                        </Button>
                                    </Box>
                                    <RadioGroup defaultValue="address0">
                                        {
                                            userAddress.map((el, index) => {
                                                return (
                                                    <Paper key={index}
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: "5px",
                                                            overflow: "hidden",
                                                            border: "1px solid #ccc",
                                                            my: 1
                                                        }}
                                                    >
                                                        {
                                                            el.status == "Enabled" &&
                                                            <Box sx={{ background: "#eee", py: 1, px: 2 }}>
                                                                <Typography><strong>Default Address</strong></Typography>
                                                            </Box>
                                                        }
                                                        <Box className="d-flex" sx={{ p: 1 }}>
                                                            <Radio id={`address${index}`} onClick={(e) => selectAddressId(el)} value={el.ecom_address_id} />
                                                            <label htmlFor={`address${index}`}>
                                                                <Typography fontSize={"14px"} variant='p' component={'p'}>
                                                                    <strong>{el.name}-{el.city},</strong> <br />
                                                                    {el.house_address},{el.street_address},{el.landmark},{el.state},{el.city},{el.pincode}, India, Phone number: {el.phone},email: {el.email}
                                                                </Typography>
                                                            </label>
                                                        </Box>
                                                        <Box className='d-flex' sx={{ px: 2 }}>
                                                            <Button onClick={toggleAddressDrawer(true, index)} className='address-btn'>
                                                                Edit
                                                            </Button>
                                                            {
                                                                el.status != "Enabled" &&
                                                                <Button onClick={event => deleteAddress(event, el.ecom_address_id)} className='address-btn'>
                                                                    Delete
                                                                </Button>
                                                            }
                                                        </Box>
                                                    </Paper>
                                                )
                                            })
                                        }

                                    </RadioGroup>
                                </AccordionDetails>
                            </Accordion>
                            {/* End, Address */}




                            {/* <Box mt={1.5}>
                                <Typography variant='h6' fontSize="14px">
                                    Address Details
                                </Typography>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField
                                            size="small"
                                            type='number'
                                            value={defaultPincode}
                                            onChange={e => {
                                                if (e.target.value.length <= 6) {
                                                    setUser(prev => {
                                                        return { ...prev, user_pincode: e.target.value, appintment_date: null }
                                                    });
                                                    setDefaultPincode(prev => e.target.value);
                                                    //console.log(e.target.value.length);
                                                    if (e.target.value.length == 6) {
                                                        getCoords(e.target.value);
                                                    }
                                                }
                                            }}
                                            fullWidth
                                            label="Pincode"
                                            variant="filled"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextareaAutosize
                                            minRows={3}
                                            placeholder="Please enter complete address."
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                marginTop: "10px",
                                                width: "100%",
                                                borderRadius: "4px 4px 0 0px",
                                                border: "none",
                                                background: "#eee",
                                                borderBottom: "2px solid #ccc",
                                                outline: 0
                                            }}
                                            value={defaultAddress}
                                            onChange={e => {
                                                setUser(prev => {
                                                    return { ...prev, user_address: e.target.value }
                                                });
                                                setDefaultAddress(prev => e.target.value);
                                            }}
                                        />
                                        {
                                            (user.user_address && user.user_address.length < 25) &&
                                            <Typography className='text-red' variant='h6' fontSize='12px'>
                                                The length of an address should be more than 25 characters.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                            </Box> */}
                            {
                                JSON.parse(localStorage.getItem("lab_cart")) && JSON.parse(localStorage.getItem("lab_cart")).lab_id == "11" ?
                                    <>
                                        <Box mt={1.5}>
                                            <Typography variant='h6' fontSize="14px">
                                                Locality Choose
                                            </Typography>
                                            <Box>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ mb: 1.5 }}>
                                                            <FormControl fullWidth>
                                                                <select
                                                                    className='html-to-mui'
                                                                    label="City"
                                                                    onChange={(e) => getLocalities(e.target.value)}
                                                                >
                                                                    {/* map function based on API call for state */}
                                                                    <option value="">Select City</option>
                                                                    {
                                                                        cities && cities.map((city, index) => {
                                                                            return (
                                                                                <option key={index} value={city.id}>{city.name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ mb: 1.5 }}>
                                                            <FormControl fullWidth>
                                                                <select
                                                                    className='html-to-mui'
                                                                    label="Locality"
                                                                    value={lalLocalityId}
                                                                    onChange={(e) => {
                                                                        setLalLocalityId(e.target.value);
                                                                        setUser({ ...user, lalLocalityId: lalLocalityId });
                                                                    }}
                                                                >
                                                                    {/* map function based on API call for city */}

                                                                    <option value="" >Select Locality</option>
                                                                    {
                                                                        localities && localities.map((locality, index) => {
                                                                            return (
                                                                                <option key={index} value={locality.id}>{locality.name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                            </Box>
                                        </Box>
                                    </> : ""

                            }


                            <Box mt={1.5}>
                                {
                                    defaultPincode &&
                                    <>
                                        <Typography variant='h6' fontSize="14px">
                                            Booking Date
                                        </Typography>
                                        <Box>
                                            <input
                                                type="date"
                                                className='html-to-mui'
                                                onChange={newValue => {
                                                    setUser({ ...user, appintment_date: newValue.target.value });
                                                    getSlots(newValue.target.value, defaultPincode);
                                                }}
                                                style={{
                                                    width: "100%"
                                                }}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoItem fullWidth>
                                                    <MobileDatePicker
                                                        name="appointment_date"
                                                        format="DD-MM-YYYY"
                                                        defaultValue={user.appintment_date && ""}
                                                        onChange={newValue => {
                                                            setUser({ ...user, appintment_date: newValue });
                                                            getSlots(newValue, user.user_pincode);
                                                        }}
                                                        disablePast
                                                    />
                                                </DemoItem>
                                            </LocalizationProvider> */}
                                            {/* <TextField
                                                size="small"
                                                type='number'
                                                value={lalLocalityId}
                                                fullWidth
                                                label="Test"
                                                variant="filled"
                                            /> */}
                                        </Box>



                                        <Box mt={1.5}>
                                            <Typography mb={0.5} variant='h6' fontSize="14px">
                                                Select Booking Slot
                                            </Typography>
                                            {
                                                slots.length > 0 ?
                                                    slots.map((val, index) => {
                                                        return (
                                                            <Chip
                                                                key={index}
                                                                label={val.slot}
                                                                sx={{ ml: 1, mb: 1 }}
                                                                variant="outlined"
                                                                color={(user.appintment_slot && user.appintment_slot == val.slot) ? "success" : "default"}
                                                                onClick={() => setUser({ ...user, appintment_slot: val.id })}
                                                            />
                                                        )
                                                    })
                                                    :
                                                    <Typography variant='body1' className='text-red'>
                                                        No slots available.
                                                    </Typography>
                                            }
                                        </Box>
                                    </>
                                }

                            </Box>
                            {
                                testsAdded.length > 0 &&
                                <Box mt={1.5} className="bg-green" p={2} sx={{ borderRadius: "10px" }}>
                                    <Typography variant='h6' fontSize="14px">
                                        Tests & Checkups added
                                    </Typography>
                                    {
                                        testsAdded.map((t, index) => {
                                            return (
                                                <Grid key={index} container spacing={1} className='d-flex' sx={{ justifyContent: "center" }}>
                                                    <Grid item xs={10}>
                                                        <Box py={1} px={2} mt={1}
                                                            className="d-flex justify-space-between"
                                                            sx={{ background: "#fff", borderRadius: "10px" }}
                                                        >
                                                            <Typography variant='subtitle1' fontSize="12px">
                                                                {t.name} ({t.brand})
                                                            </Typography>
                                                            <Typography variant='h6' fontSize="14px">
                                                                ₹{t.price}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Box py={0.5} mt={1}
                                                            className="d-flex"
                                                            sx={{ background: "#fff", borderRadius: "10px", justifyContent: "center" }}
                                                            onClick={() => removeTest(t.test_id)}
                                                        >
                                                            <CloseIcon sx={{ color: "#000000cc" }} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Box>
                            }

                            <Box mt={1.5} className="bg-green" p={2} sx={{ borderRadius: "10px" }}>
                                <Typography variant='h6' fontSize="16px">
                                    Total Amount
                                </Typography>
                                <Box
                                    className="d-flex justify-space-between"
                                    mt={1}
                                    sx={{
                                        borderTop: "2px dashed #ccc",
                                        borderBottom: "2px dashed #ccc",
                                        paddingY: "10px"
                                    }}
                                >
                                    <Typography variant='body1' fontSize='14px'>
                                        Total MRP :
                                    </Typography>
                                    <Typography variant='h6' fontSize='14px'>
                                        {cartTotal.total_mrp.replace("&#8377;", "₹")}
                                    </Typography>
                                </Box>
                                <Box
                                    className="d-flex justify-space-between"
                                    sx={{
                                        borderBottom: "2px dashed #ccc",
                                        paddingY: "10px"
                                    }}
                                >
                                    <Typography variant='body1' fontSize='14px'>
                                        Total Discount :
                                    </Typography>
                                    <Typography variant='h6' fontSize='14px'>
                                        {cartTotal.total_discount.replace("&#8377;", "₹")}
                                    </Typography>
                                </Box>
                                <Box
                                    className="d-flex justify-space-between"
                                    sx={{
                                        borderBottom: "2px dashed #ccc",
                                        paddingY: "10px"
                                    }}
                                >
                                    <Typography variant='body1' fontSize='14px'>
                                        Grand Total :
                                    </Typography>
                                    <Typography variant='h6' fontSize='14px'>
                                        {cartTotal.total_amount.replace("&#8377;", "₹")}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box mt={1.5} mb={3}>
                                {
                                    errMsg.length > 0 &&
                                    <Typography className='text-red' variant='h6' fontSize='14px'>
                                        {errMsg}
                                    </Typography>
                                }

                                {
                                    (

                                        user != "" &&
                                        gender != "" &&
                                        testsAdded.length > 0 &&
                                        user.user_address &&
                                        user.user_address.length >= 25
                                    )
                                        ?
                                        <>
                                            {
                                                clickedBooking == 1 ?
                                                    <LoadingButton
                                                        loading
                                                        loadingPosition="start"
                                                        variant="outlined"
                                                        startIcon={<KeyboardArrowRight />}
                                                        fullWidth
                                                    >
                                                        Please Wait
                                                    </LoadingButton>
                                                    :
                                                    <Button
                                                        type="button"
                                                        sx={{ px: 3 }}
                                                        fullWidth
                                                        className='web-btn d-flex justify-space-between'
                                                        onClick={bookSubmit}
                                                    >
                                                        <>Book Now</>
                                                        <ChevronRightIcon />
                                                    </Button>
                                            }
                                        </>
                                        :
                                        <Button
                                            type="button"
                                            sx={{ px: 3 }}
                                            fullWidth
                                            disabled
                                        >
                                            <>Book Now</>
                                            <ChevronRightIcon />
                                        </Button>
                                }


                            </Box>

                        </Container>
                        {/* New Address Drawer */}
                        <Drawer
                            anchor="bottom"
                            open={newAddressDrawer}
                            onClose={toggleAddressDrawer(false)}
                            sx={{ zIndex: 99999 }}
                        >
                            <CloseIcon className='drawer-close-icon' onClick={toggleAddressDrawer(false)} />
                            <Box sx={{ width: 'auto', px: 2, pb: 1, pt: 2 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Box sx={{ mb: 1.5 }}>
                                            <TextField size="small" type='text' value={name} fullWidth label="Name" variant="filled" onChange={(e) => setName(e.target.value)} />
                                            <TextField size="small" hiddenLabel type='hidden' value={addressId} fullWidth variant="filled" onChange={(e) => setName(e.target.value)} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ mb: 1.5 }}>
                                            <TextField size="small" type='number' value={phone} fullWidth label="Mobile Number" variant="filled" onChange={(e) => setPhone(e.target.value)} />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mb: 1.5 }}>
                                    <TextField size="small" type='email' value={email} fullWidth label="Email Address" variant="filled" onChange={(e) => setEmail(e.target.value)} />
                                </Box>
                                <Box sx={{ mb: 1.5 }}>
                                    <TextField size="small" type='text' fullWidth value={houseAddress} label="House No. / Building Name" variant="filled" onChange={(e) => setHouseAddress(e.target.value)} />
                                </Box>
                                <Box sx={{ mb: 1.5 }}>
                                    <TextField size="small" type='text' fullWidth value={streetAddress} label="Street Name / Colony" variant="filled" onChange={(e) => setStreetAddress(e.target.value)} />
                                </Box>
                                <Box sx={{ mb: 1.5 }}>
                                    <TextField size="small" type='text' fullWidth value={landmark} label="Landmark" variant="filled" onChange={(e) => setLandmark(e.target.value)} />
                                </Box>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Box sx={{ mb: 1.5 }}>
                                            <FormControl fullWidth>
                                                <select
                                                    className='html-to-mui'
                                                    label="State"
                                                    onClick={fetchLocation}
                                                    value={addressState}
                                                    onChange={(e) => setAddressState(e.target.value)}
                                                >
                                                    {/* map function based on API call for state */}
                                                    <option value="">Select State</option>
                                                    {
                                                        states && states.map((state, index) => {
                                                            return (
                                                                <option key={index} value={state.state}>{state.state}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ mb: 1.5 }}>
                                            <FormControl fullWidth>
                                                <select
                                                    className='html-to-mui'
                                                    label="State"
                                                    value={addressState ? addressCity : ""}
                                                    onChange={(e) => setAddressCity(e.target.value)}
                                                >
                                                    {/* map function based on API call for city */}

                                                    <option value="" >Select City</option>
                                                    {
                                                        cities && cities.map((city, index) => {
                                                            return (
                                                                <option key={index} value={city.city}>{city.city}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mb: 1.5 }}>
                                    <TextField size="small" type='number' fullWidth value={pincode} label="Pincode" variant="filled" onChange={(e) => {
                                        if (e.target.value.length <= 6) {
                                            setPincode(e.target.value);
                                        }
                                    }} />
                                </Box>
                                <Box sx={{ mb: 1 }} className="d-flex">
                                    <Checkbox id="default-address-checkbox" onChange={(e) => setStatus("Enabled")} value={status} />
                                    <label htmlFor='default-address-checkbox'>
                                        <Typography>Default Address</Typography>
                                    </label>
                                </Box>
                                <Box>
                                    {
                                        addressId == "" ?
                                            <Button onClick={addAddress} fullWidth className='web-btn'>
                                                Add New Address
                                            </Button>
                                            :
                                            <Button onClick={addAddress} fullWidth className='web-btn'>
                                                Update Address
                                            </Button>
                                    }

                                </Box>
                            </Box>
                        </Drawer>
                        {/* End, New Address Drawer */}
                    </>
            }
        </>
    )
}

// Skeleton
const showSkeleton = () => {
    return (
        <>
            <Container sx={{ mt: 5 }}>
                <Grid container spacing={2}>
                    {new Array(3).fill(0).map((el, index) => {
                        return (
                            <Grid key={index} item xs={12}>
                                <Skeleton
                                    animation="wave"
                                    width="100%"
                                    style={{ height: "180px", marginTop: "-50px" }}
                                />
                                <Box sx={{ marginTop: "-25px" }}>
                                    <Skeleton
                                        animation="wave"
                                        width="70%"
                                        style={{ height: "20px" }}
                                    />
                                </Box>
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        width="90%"
                                        style={{ height: "20px" }}
                                    />
                                </Box>
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        width="60%"
                                        style={{ height: "20px" }}
                                    />
                                </Box>
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        width="100%"
                                        style={{ height: "60px", marginTop: "-5px" }}
                                    />
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </>
    )
}