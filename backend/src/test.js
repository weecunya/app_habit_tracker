

async request (){
    const habits = await fetch("http://127.0.0.1:8000/api/login",
        {method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            username: 'string',
            password: 'string'
            }),
        }
    );

    const data = await habits.json();

}