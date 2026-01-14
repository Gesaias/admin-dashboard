'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
      const data = await api.post('/auth/login', { identifier, password }).catch((error) => {
        console.log(error);
        throw error;
      });
      
      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      router.push('/dashboard');
    // } catch (error) {
    //   if (error instanceof AxiosError && error.response?.status && error.response.status === 401) {
    //     toast.error("Credenciais inválidas", {
    //         description: "Usuário/Email ou senha inválidos",
    //         closeButton: true,
    //         duration: 5000,
    //       })
    //     return;
    //   }

    //   toast.error("Erro ao fazer login", {
    //       description: (error as Error)?.message ?? "Houve um erro ao fazer login",
    //       closeButton: true,
    //       duration: 5000,
    //     })
    //     return;
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}