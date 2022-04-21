function handleErrors(response) {
    if (!response.ok) throw Error(response.statusText);
    return response;
  };
  
  export const loginRequest = async (email, password) => {
  
      const response = await fetch(process.env.REACT_APP_BACK_END + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: email,
            password: password,
            path: window.location.href
          })
      })
        .then(handleErrors)
        .then(response => response.json())
        .catch(error => console.log(error));
  
      return response;
  };
  
  export const checkAuth = async () => {
  
    const response = await fetch(process.env.REACT_APP_BACK_END + '/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include'
      })
        .then(handleErrors)
        .then(response => response.json())
        .catch(error => console.log(error));
  
    return response;
  };
  
  export const logout = async () => {
  
    const response = await fetch(process.env.REACT_APP_BACK_END + '/auth/logout', {
      method: 'GET',
      credentials: 'include'
    })
      .then(handleErrors)
      .then(response => response.json())
      .catch(error => console.log(error));
  
    return;
  };