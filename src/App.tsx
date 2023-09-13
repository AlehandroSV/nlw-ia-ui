import { Button } from './shared/components/ui/button';
import { FileVideo, Github, Upload, Wand2 } from 'lucide-react';
import { Separator } from './shared/components/ui/separator';
import { Textarea } from './shared/components/ui/textarea';
import { Label } from './shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './shared/components/ui/select';
import { Slider } from './shared/components/ui/slider';

export default function App() {
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
            />
            <Textarea
              placeholder='Resultado gerado pela IA...'
              className='resize-none p-4 leading-relaxed'
              readOnly
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
          <form className='space-y-6'>
            <label
              htmlFor='video'
              className='border-2 flex rounded-md aspect-video border-dashed cursor-pointer text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5'
            >
              <FileVideo className='w-4 h-4' />
              Selecione um vídeo
            </label>
            <input
              type='file'
              id='video'
              accept='video/mp4'
              className='sr-only'
            />

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>
                Prompt de Transcrição
              </Label>
              <Textarea
                className='h-20 leading-relaxed resize-none'
                id='transcription_prompt'
                placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
              />
            </div>

            <Button type='submit' className='w-full'>
              Carregar Vídeo <Upload className='w-4 h-4 ml-2' />
            </Button>
          </form>

          <Separator />

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Modelo</Label>

              <Select defaultValue=''>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um prompt...' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='title'>Título do YouTube</SelectItem>
                  <SelectItem value='description'>
                    Descrição do YouTube
                  </SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Temperatura</Label>

              <Slider min={0} max={1} step={0.1} defaultValue={[0.5]} />

              <span className='block text-sm text-muted-foreground italic'>
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button type='submit' className='w-full'>
              Executar
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
