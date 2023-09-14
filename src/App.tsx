import { Button } from '@/shared/components/ui/button';
import { Github, Wand2 } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Slider } from '@/shared/components/ui/slider';
import { VideoInputForm } from '@/shared/components/video-input-form';
import { PromptSelect } from '@/shared/components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react';

export default function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3000/ai/generate',
    body: {
      videoId: videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='px-6 py-3 flex items-center justify-between border-b'>
        <h1 className='text-xl font-bold'>Upload.AI</h1>

        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>
          <Separator orientation='vertical' className='h-6' />

          <Button variant='outline'>
            <Github className='w-4 mr-2' />
            GitHub
          </Button>
        </div>
      </div>

      <main className='flex-1 p-6 flex gap-6'>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-row-2 gap-4 flex-1'>
            <Textarea
              placeholder='Inclua o prompt para a IA...'
              className='resize-none p-4 leading-relaxed'
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              placeholder='Resultado gerado pela IA...'
              className='resize-none p-4 leading-relaxed'
              readOnly
              value={completion}
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Lembre-se: Você pode utilizar a variável
            <code className='text-violet-400'>
              {' '}
              &#10100;transcription&#10101;{' '}
            </code>
            no seu prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>
        <aside className='w-80 space-y-6'>
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>

              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className='space-y-2'>
              <Label>Modelo</Label>

              <Select defaultValue='gpt3.5' disabled>
                <SelectTrigger>
                  <SelectValue></SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <span className='block text-sm text-muted-foreground italic'>
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <Label>Temperatura</Label>
                {temperature}
              </div>

              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className='block text-sm text-muted-foreground italic'>
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button type='submit' className='w-full' disabled={isLoading}>
              Executar
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
