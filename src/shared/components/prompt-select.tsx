import { api } from '@/lib/axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useEffect, useState } from 'react';

interface Prompts {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onPromptSelected: (template: string) => void;
}

export function PromptSelect(props: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompts[] | null>(null);

  useEffect(() => {
    api.get('/prompts').then((res) => {
      setPrompts(res.data);
    });
  }, []);

  const handlePropmptSelect = (promptId: string) => {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) {
      return;
    }

    props.onPromptSelected(selectedPrompt.template);
  };

  return (
    <Select onValueChange={handlePropmptSelect}>
      <SelectTrigger>
        <SelectValue placeholder='Selecione um prompt...' />
      </SelectTrigger>

      <SelectContent>
        {prompts?.length !== 0 ? (
          prompts?.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          ))
        ) : (
          <SelectItem value=''>
            Ops... Parece que algo deu errado! Tente novamente mais tarde!
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
