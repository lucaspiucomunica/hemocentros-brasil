import { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Upload, Image as ImageIcon, Download, Loader2, AlertCircle, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { getCroppedImg, type CropAreaPixels } from "@/utils/cropImage";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const ASPECT_MOLDURA = 9 / 16;

type PageState = 'idle' | 'crop' | 'preview' | 'loading' | 'result' | 'error';

const FotoMoldura = () => {
  const [state, setState] = useState<PageState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropAreaPixels | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpeza de URLs para evitar memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const onCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels as CropAreaPixels);
  }, []);

  const onCropAreaChange = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels as CropAreaPixels);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Limpa URL anterior se existir
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setCroppedBlob(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState('crop');
    setError(null);
  };

  const handleConfirmCrop = useCallback(async () => {
    if (!previewUrl || !croppedAreaPixels) {
      setError('Ajuste a área de recorte na imagem e tente novamente.');
      return;
    }
    try {
      const blob = await getCroppedImg(previewUrl, croppedAreaPixels);
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setCroppedBlob(blob);
      setState('preview');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recortar a imagem');
      setState('error');
    }
  }, [previewUrl, croppedAreaPixels]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    const fileToSend = croppedBlob ?? selectedFile;
    if (!fileToSend) return;

    setState('loading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('data', fileToSend);

      // Em desenvolvimento usamos o proxy (/api/foto-moldura);
      // em produção chamamos diretamente o webhook do n8n.
      const webhookUrl = import.meta.env.DEV
        ? "/api/foto-moldura"
        : import.meta.env.VITE_WEBHOOK_MOLDURA;

      if (!webhookUrl) {
        throw new Error('URL do webhook não configurada. Verifique as variáveis de ambiente.');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao processar imagem (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar a imagem');
      setState('error');
    }
  };

  const handleReset = () => {
    // Limpa URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    // Reseta estado
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedBlob(null);
    setCroppedAreaPixels(null);
    setResultUrl(null);
    setError(null);
    setState('idle');

    // Limpa input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTryAgain = () => {
    setError(null);
    // Se ainda não confirmou o recorte, volta para a tela de crop
    if (selectedFile && !croppedBlob) setState('crop');
    else setState('preview');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Foto com Moldura</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-4xl font-bold mb-8 text-center">Foto com Moldura</h1>
        {/* Estado: Idle - Upload Area */}
        {state === 'idle' && (
          <>
            <div className="mb-6 rounded-lg bg-muted/60 border border-border p-4 text-center text-sm text-muted-foreground">
              <strong className="text-foreground">Dica:</strong> Para o melhor resultado, use uma foto em formato vertical (proporção 9:16). Na próxima etapa você poderá recortar a imagem nessa proporção.
            </div>
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-8 md:p-12">
                <div
                  className={`
                    flex flex-col items-center justify-center text-center space-y-4
                    cursor-pointer transition-all duration-300
                    ${isDragging ? 'scale-105' : 'scale-100'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={`
                    p-6 rounded-full transition-colors
                    ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}
                  `}>
                    <Upload className={`
                      w-12 h-12 transition-colors
                      ${isDragging ? 'text-primary' : 'text-muted-foreground'}
                    `} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isDragging ? 'Solte sua foto aqui' : 'Envie sua foto'}
                    </h3>
                    <p className="text-muted-foreground">
                      Clique para selecionar ou arraste e solte uma imagem
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Formatos aceitos: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Estado: Crop - Recorte em 9:16 */}
        {state === 'crop' && previewUrl && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Crop className="w-5 h-5" />
                  Recorte na proporção 9:16
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajuste a área de recorte (arraste e use o zoom se precisar). A moldura ficará no formato vertical 9:16.
                </p>
                <div className="relative w-full aspect-[9/16] max-h-[70vh] rounded-lg overflow-hidden bg-muted">
                  {/* Foto sendo recortada */}
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={ASPECT_MOLDURA}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    onCropAreaChange={onCropAreaChange}
                    objectFit="contain"
                  />

                  {/* Moldura sobreposta para indicar área segura */}
                  <img
                    src="/moldura.png"
                    alt="Moldura de referência"
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-sm text-muted-foreground block mb-2">Zoom</label>
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value ?? 1)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConfirmCrop}
                size="lg"
                className="flex-1 text-base"
              >
                Confirmar recorte
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Escolher outra foto
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Preview */}
        {state === 'preview' && previewUrl && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Prévia da sua foto</h3>
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Arquivo:</strong> {selectedFile?.name}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex-1 text-base"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Aplicar Moldura
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Escolher outra foto
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Loading */}
        {state === 'loading' && (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Processando sua foto...
                  </h3>
                  <p className="text-muted-foreground">
                    Aguarde enquanto aplicamos a moldura
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado: Result */}
        {state === 'result' && resultUrl && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Sua foto está pronta!
                  </h3>
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={resultUrl}
                      alt="Foto com moldura"
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="flex-1 text-base"
              >
                <a href={resultUrl} download="foto_com_moldura.png">
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Imagem
                </a>
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Enviar outra foto
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Error */}
        {state === 'error' && (
          <div className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro ao processar a imagem:</strong>
                <br />
                {error}
              </AlertDescription>
            </Alert>

            {previewUrl && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Sua foto</h3>
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleTryAgain}
                size="lg"
                className="flex-1 text-base"
              >
                Tentar novamente
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Escolher outra foto
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FotoMoldura;
