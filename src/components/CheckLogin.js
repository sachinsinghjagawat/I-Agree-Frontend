async function CheckLogin (path, navigate, callback) {
    try {
        const res = await fetch (path, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            credentials: "include"
        })

        const data = await res.json();
        // console.log(data);

        if (!res.status === 200 || !data) {
            throw new Error (res.error);
        }
        if (callback) callback(data);
    }catch (err) {
        console.log(err);
        if (callback) callback(false);
        navigate ('/login');
    }
}

export default CheckLogin;