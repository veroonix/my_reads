import { useState } from 'react'

const API_URL = 'http://localhost:1337';

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function loginUser(event) {
    event.preventDefault()
    const response =  await fetch(`${API_URL}/api/login`,  {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email, 
        password,
      })
    })

    console.log("Ответ сервера:", response); // Добавляем логирование

    const data = await response.json()

    if (data.status === 'ok') {
      alert('Авторизация прошла успешно')

      sessionStorage.setItem('accessToken', data.accessToken);

      window.location.href = '/search' //поменять на свою
    } else {
      alert('Пожалуйста, проверьте своё имя и пароль')
    }

    console.log(data)
  }

  return ( <div>
    <h1>Login</h1>
    <form onSubmit={loginUser}> 
      <input
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        type = "email" 
        placeholder="Email" 
      /> 
      <br />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        type = "password" 
        placeholder="Password"
      />
      <br />
      <input type="submit" value="LoginUser"/> 
    </form>
    </div>
  );
}

export default App;
