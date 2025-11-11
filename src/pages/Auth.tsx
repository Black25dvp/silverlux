import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Email inválido' }).max(255),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }).max(100)
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setLoading(true);

      if (isLogin) {
        const { error } = await signIn(validated.email, validated.password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(validated.email, validated.password);

        if (error) {
          toast.error('Erro ao criar conta: ' + error.message);
        } else {
          toast.success('Conta criada com sucesso!');
          navigate('/');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Silver<span className="text-accent">Luxe</span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? 'Entre com suas credenciais' : 'Crie sua conta para começar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </Button>
        </form>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            {isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
