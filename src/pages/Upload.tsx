import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileText, X } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [examName, setExamName] = useState("");
  const [answerKeyVersion, setAnswerKeyVersion] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      setFiles(prev => [...prev, ...pdfFiles]);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length > 0) {
        setFiles(prev => [...prev, ...pdfFiles]);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF files only",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examName || !answerKeyVersion || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select files",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Upload Successful",
        description: `${files.length} files uploaded for processing`,
      });
      navigate("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:shadow-md transition-all duration-200"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Upload OMR Sheets</h1>
          <p className="text-muted-foreground">Upload PDF files containing OMR sheets for evaluation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card className="animate-slide-up shadow-lg">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examName">Exam Name</Label>
                  <Input
                    id="examName"
                    type="text"
                    placeholder="e.g., Mathematics Final Exam 2024"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="transition-all duration-200 focus:shadow-glow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answerKey">Answer Key Version</Label>
                  <Select value={answerKeyVersion} onValueChange={setAnswerKeyVersion}>
                    <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
                      <SelectValue placeholder="Select answer key version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="version-a">Version A</SelectItem>
                      <SelectItem value="version-b">Version B</SelectItem>
                      <SelectItem value="version-c">Version C</SelectItem>
                      <SelectItem value="version-d">Version D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full transition-all duration-300"
                  disabled={isUploading || files.length === 0}
                >
                  {isUploading ? "Processing Upload..." : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card className="animate-scale-in shadow-lg">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drag and drop PDF files here</h3>
                <p className="text-muted-foreground mb-4">or</p>
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium text-foreground">Selected Files ({files.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-bounce-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;