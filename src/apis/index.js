import {api} from '../config/mainapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showtoast} from '../config/utilFunctions';

export const loginUser = async (
  email,
  password,
  setloading,
  setuser,
  settoken,
) => {
  if (!email || !password) return alert('Please enter email and password');
  const obj = {
    email: email,
    password: password,
  };
  setloading(true);
  try {
    const {data} = await api.post('/user/login', obj);
    if (data) {
      //    setloading(false)
      await AsyncStorage.setItem('token', JSON.stringify(data.token));
      settoken(data.token);
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);

          //  navigation.navigate('UserScreens')
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    console.log('error');
    setloading(false);
    alert(error.response.data.message);
  }
};

export const logout = async (setuser, settoken, setuserloading) => {
  setuserloading(true);
  await AsyncStorage.clear();
  setuser(null);
  settoken(null);
  setuserloading(false);
};

export const getUserfromAsyncstorage = async (
  setloading,
  setuser,
  settoken,
) => {
  setloading(true);
  let token = await AsyncStorage.getItem('token');
  token = token !== null ? JSON.parse(token) : null;
  settoken(token);
  AsyncStorage.getItem('user')
    .then(res => {
      if (res !== null) {
        setuser(JSON.parse(res));
        setloading(false);
      } else {
        setuser(null);
        setloading(false);
      }
    })
    .catch(err => {
      setloading(false);
      console.log(err);
    });
};

export const updateMeasures = async (
  obj,
  setloading,
  setuser,
  id,
  setclose,
) => {
  if (!obj) {
    return alert('Please provide the value');
  }
  setloading(true);
  try {
    const {data} = await api.post(`/user/updateMeasures/${id}`, obj);
    if (data) {
      //    setloading(false)
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          setclose(false);
          //  navigation.navigate('UserScreens')
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const uploadimages = async (
  setloading,
  images,
  id,
  setclose,
  setuser,
  setimages,
) => {
  setloading(true);
  const obj = {
    images: JSON.stringify(images),
  };
  try {
    const {data} = await api.post(`/user/uploadimage/${id}`, obj);
    console.log(data, 'I am data');
    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          setclose(false);
          setimages([
            {
              display: 'Frente',
              image: '',
            },
            {
              display: 'Lado',
              image: '',
            },
            {
              display: 'Espalda',
              image: '',
            },
          ]);
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const deleteimages = async (
  setloading,
  displayarr,
  setclose,
  setuser,
  user,
  toast,
) => {
  setloading(true);
  const obj = {
    displays: JSON.stringify(displayarr),
  };
  try {
    const {data} = await api.post(`/user/deleteimages/${user?.data?._id}`, obj);
    console.log(data, 'I am data');
    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          setclose(false);
          showtoast(
            toast,
            'Deleted',
            'success',
            'Images deleted successfully',
            'top',
          );
        })
        .catch(err => {
          console.log(err);
          setloading(false);
        });
    }
  } catch (error) {
    console.log(error);

    setloading(false);
    alert(error.response.data.message);
  }
};

export const updateMeasuresRecord = async (
  setloading,
  setmeasure,
  user,
  measure,
  setuser,
  setdates,
) => {
  setloading(true);
  try {
    const {data} = await api.get(
      `/user/updateMeasureRecords/${user?.data?._id}/${measure}`,
    );
    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          let arr = [];
          let datesarr = [];
          data?.data[`${measure}Record`].forEach(m => {
            let day = new Date(m.date).getDate();
            arr.push(Number(m.value));
            datesarr.push(String(day));
          });
          setmeasure(arr);
          setdates(datesarr);
        })
        .catch(err => {
          console.log(err);
          setloading(false);
        });
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const getMeals = async (
  setloading,
  setmeals,
  day,
  user,
  setnutrients,
) => {
  setloading(true);
  try {
    const {data} = await api.get(`/meal/getMeal/${user?.data?._id}/${day}`);
    if (data) {
      setmeals(data.data);
      setnutrients(data.nutrients);
      setloading(false);
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const getMealDetails = async (setloading, setsinglemeal, id) => {
  setloading(true);
  try {
    const {data} = await api.get(`/meal/getMealDetails/${id}`);
    if (data) {
      setloading(false);
      setsinglemeal(data.data);
    }
  } catch (error) {
    setloading(false);
    alert(error?.response?.data.message);
  }
};

export const removemealfromuserlist = async (
  setloading,
  toast,
  user,
  setclose,
  setshowmodal,
) => {
  setloading(true);
  try {
    const {data} = await api.post(
      `/meal/removemealfromuserslist/${user?.data?._id}`,
    );
    if (data) {
      setloading(false);
      setclose(false);
      setshowmodal(true);
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const getMealIngredients = async (
  setloading,
  day,
  user,
  setingredients,
) => {
  setloading(true);
  try {
    const {data} = await api.get(`/meal/getMealIngs/${user?.data?._id}/${day}`);
    if (data) {
      setloading(false);
      setingredients(data.data);
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const sendingstoemail = async (
  setloading,
  setclose,
  email,
  toast,
  ings,
) => {
  setloading(true);
  console.log(ings, email);
  const obj = {
    ings: JSON.stringify(ings),
    email: email,
  };

  try {
    const {data} = await api.post(`/meal/sendingstoemail`, obj);
    if (data) {
      setloading(false);
      setclose(false);
      showtoast(
        toast,
        'Sent',
        'success',
        'Email has been sent successfully to your email',
        'top',
      );
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const generateingredientslist = async (
  setloading,
  navigation,
  user,
  setingredients,
  days,
  persons,
) => {
  setloading(true);

  const obj = {
    days: JSON.stringify(days),
    persons: persons,
  };

  try {
    const {data} = await api.post(`/meal/getallings/${user?.data?._id}`, obj);
    if (data) {
      setloading(false);
      setingredients(data.data);
      navigation.navigate('ShoppingListScreen', {
        day: 'nothing',
        callapi: false,
      });
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const getAllExercises = async (
  setloading,
  user,
  day,
  week,
  setexercises,
  toast,
) => {
  setloading(true);

  const obj = {
    day: day,
    week: week,
  };

  try {
    const {data} = await api.post(
      `/setsandreps/getuserexercises/${user?.data?._id}`,
      obj,
    );
    if (data) {
      console.log(data, 'I am data');
      setloading(false);
      setexercises(data.data);
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const getAllUserExercises = async (setloading, setUserExercises, id) => {
  setloading(true);
  try {
    const {data} = await api.get(`/exercise/getAllUserExercises/${id}`);
    if (data) {
      setloading(false);
      setUserExercises(data.data);
    }
  } catch (error) {
    setloading(false);
    alert(error.response.data.message);
  }
};

export const createRecord = async (
  setloading,
  week,
  valueone,
  valuetwo,
  valuethree,
  valuefour,
  recordtext,
  user,
  exerciseId,
  toast,
  setrecord,
  recordId,
) => {
  if (!valueone || !valuetwo || !valuethree) {
    return showtoast( 
      toast,
      'advertencia',
      'warning',
      'Los campos obligatorios no pueden estar vacíos',
      'top',
    );
  }
  setloading(true);
  let arr = [
    {
      scoreone: valueone,
    },
    {
      scoretwo: valuetwo,
    },
    {
      scorethree: valuethree,
    },
    // ...(valuefour !== '' && {
    //   scorefour: valuefour,
    // }), 
    {
      recordtext: recordtext,
    },
  ];

  if(valuefour !== ''){
    arr[3] = {scorefour: valuefour}
    arr[4] = {recordtext: recordtext}
  }

  const obj = {
    weekobj: {[week]: true},
    records: JSON.stringify(arr),
    recordId: recordId,
  };

  try {
    const {data} = await api.post(
      `/record/createRecord/${user?.data?._id}/${exerciseId}`,
      obj,
    );

    if (data) {
      setloading(false);
      setrecord(data.data);
      showtoast(
        toast,
        'New Record',
        'success',
        'Your new Record has been created successfully',
        'top',
      );
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const createRecordNormalSet = async (
  setloading,
  week,
  valueone,
  valuetwo,
  valuethree,
  valuefour,
  valuefive,
  valuesix,
  valueseven,
  valueeight,
  recordtext,
  user,
  exerciseId,
  toast,
  setrecord,
  recordId,
) => {
  if (
    !valueone ||
    !valuetwo ||
    !valuethree ||
    !valuefour ||
    !valuefive ||
    !valuesix 
    // !valueseven ||
    // !valueeight
  ) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Los campos obligatorios no pueden estar vacíos',
      'top',
    );
  }
  setloading(true);
  let arr = [
    {
      scoreone: valueone,
      scoreoneweight: valuefour,
    },
    {
      scoretwo: valuetwo,
      scoretwoweight: valuefive,
    },
    {
      scorethree: valuethree,
      scorethreeweight: valuesix,
    },
    // {
    //   scorefour: valueseven,
    //   scorefourweight: valueeight,
    // },
    {
      recordtext: recordtext,
    },
  ];

  if(valueseven !== '' || valueeight !== ''){
    arr[3] = {scorefour: valueseven, scorefourweight: valueeight}
    arr[4] = {recordtext: recordtext}
  }


  const obj = {
    weekobj: {[week]: true},
    records: JSON.stringify(arr),
    recordId: recordId,
  };

  try {
    const {data} = await api.post(
      `/record/createRecord/${user?.data?._id}/${exerciseId}`,
      obj,
    );

    if (data) {
      setloading(false);
      setrecord(data.data);
      showtoast(
        toast,
        'New Record',
        'success',
        'Your new Record has been created successfully',
        'top',
      );
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};
export const getRecords = async (
  setloading,
  user,
  exerciseId,
  setrecords,
  toast,
) => {
  setloading(true);

  try {
    const {data} = await api.get(
      `/record/getRecords/${user?.data?._id}/${exerciseId}`,
    );
    if (data) {
      setloading(false);
      setrecords(data.data);
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const updateUsername = async (
  setloading,
  setuser,
  firstname,
  lastname,
  token,
  toast,
) => {
  setloading(true);

  const obj = {
    firstname,
    lastname,
  };

  try {
    const {data} = await api.post(`/user/updateusername`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const updateUserPhone = async (
  setloading,
  setuser,
  token,
  toast,
  phoneNumber,
) => {
  setloading(true);

  const obj = {
    phoneNumber,
  };

  try {
    const {data} = await api.post(`/user/updateusername`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const updateUserDob = async (setloading, setuser, token, toast, dob) => {
  setloading(true);

  const obj = {
    dob,
  };

  try {
    const {data} = await api.post(`/user/updateusername`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const updateUserAddress = async (
  setloading,
  setuser,
  token,
  toast,
  address,
) => {
  setloading(true);

  const obj = {
    address,
  };

  try {
    const {data} = await api.post(`/user/updateusername`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};
export const updateUserimage = async (
  setloading,
  setuser,
  image,
  token,
  toast,
  setimage,
) => {
  setloading(true);

  const obj = {
    image: image,
  };

  try {
    const {data} = await api.post(`/user/updateuserimage`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
          setimage('');
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const updateUserpassword = async (
  setloading,
  setuser,
  currentpassword,
  newpassword,
  confirmpassword,
  token,
  toast,
  navigation,
) => {
  if (!currentpassword || !newpassword || !confirmpassword) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Por favor, rellene los campos obligatorios',
      'top',
    );
  }

  if (confirmpassword !== newpassword) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Sus contraseñas no coinciden',
      'top',
    );
  }

  setloading(true);

  const obj = {
    currentpassword,
    newpassword,
  };

  try {
    const {data} = await api.post(`/user/updateuserpassword`, obj, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (data) {
      AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => {
          setloading(false);
          setuser(data);
          showtoast(
            toast,
            'Éxito',
            'success',
            'el nombre de usuario ha sido actualizado con éxito',
            'top',
          );
          navigation.goBack();
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const forgotpassword = async (setloading, email, navigation, toast) => {
  if (!email) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Por favor, rellene los campos obligatorios',
      'top',
    );
  }

  setloading(true);

  const obj = {
    email,
  };

  try {
    const {data} = await api.post(`/user/forgotpassword`, obj);

    if (data) {
      setloading(false);
      navigation.navigate('ForgotPasswordOtpScreen');
      showtoast(
        toast,
        'Éxito',
        'success',
        'Se ha enviado un correo para restablecer su contraseña',
        'top',
      );
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const matchOtp = async (setloading, otp, navigation, toast) => {
  if (!otp) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'ingrese el otp enviado a su correo electrónico para continuar',
      'top',
    );
  }

  setloading(true);

  const obj = {
    otp,
  };

  try {
    const {data} = await api.post(`/user/matchotp`, obj);

    if (data) {
      setloading(false);
      navigation.navigate('ResetPasswordScreen');
      showtoast(
        toast,
        'Éxito',
        'success',
        'Su Otp ha sido emparejado con éxito ahora puede restablecer su contraseña',
        'top',
      );
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};

export const resetPassword = async (
  setloading,
  newpassword,
  confirmpassword,
  navigation,
  toast,
  setshowmodal,
  email,
) => {
  if (!newpassword || !confirmpassword) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Por favor llene todos los campos requeridos',
      'top',
    );
  }

  if (confirmpassword !== newpassword) {
    return showtoast(
      toast,
      'advertencia',
      'warning',
      'Sus contraseñas no coinciden',
      'top',
    );
  }

  setloading(true);

  const obj = {
    newpassword,
    confirmpassword,
    email,
  };

  try {
    const {data} = await api.post(`/user/resetpassword`, obj);

    if (data) {
      setloading(false);
      showtoast(
        toast,
        'Éxito',
        'success',
        'Su contraseña ha sido restablecida con éxito',
        'top',
      );
      navigation.navigate('UserLogin');
    }
  } catch (error) {
    setloading(false);
    showtoast(toast, 'Error', 'error', error.response.data.message, 'top');
  }
};
