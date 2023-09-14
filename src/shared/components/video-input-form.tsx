import { api } from '@/lib/axios';
import { getFFmpeg } from '@/lib/ffmpeg';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { fetchFile } from '@ffmpeg/util';
import { Label } from '@radix-ui/react-label';
import { Separator } from '@radix-ui/react-separator';
import { FileVideo, Upload } from 'lucide-react';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

const statusMessages = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!',
};

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('waiting');

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const convertVideoToAudio = async (video: File) => {
    console.log('Inital convert');

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video));

    ffmpeg.on('progress', (progress) => {
      console.log('Convert prograss: ' + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ]);

    const data = await ffmpeg.readFile('output.mp3');

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    });

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus('converting');

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append('file', audioFile);

    setStatus('uploading');

    const response = await api.post('/videos', data);

    const videoId = response.data.id;

    setStatus('generating');

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus('success');
    props.onVideoUploaded(videoId);
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  };

  const previewUrl = useMemo(() => {
    if (!videoFile) {
      return undefined;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className='space-y-6' onSubmit={handleUploadVideo}>
      <label
        htmlFor='video'
        className='relative overflow-hidden border-2 p-0 flex rounded-md aspect-video border-dashed cursor-pointer text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5'
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className='pointer-events-none absolute inset-0'
          />
        ) : (
          <>
            <FileVideo className='w-4 h-4' />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type='file'
        id='video'
        accept='video/mp4'
        className='sr-only'
        onChange={handleFileSelected}
      />

      <Separator />

      <div className='space-y-2'>
        <Label htmlFor='transcription_prompt'>Prompt de Transcrição</Label>
        <Textarea
          className='h-20 leading-relaxed resize-none'
          id='transcription_prompt'
          placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
          ref={promptInputRef}
          disabled={status !== 'waiting'}
        />
      </div>

      <Button
        disabled={status !== 'waiting'}
        type='submit'
        className='w-full data-[sucess=true]:bg-emerald-400'
        data-success={status === 'success'}
      >
        {status === 'waiting' ? (
          <>
            Carregar Vídeo <Upload className='w-4 h-4 ml-2' />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
