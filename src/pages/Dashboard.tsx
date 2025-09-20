import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, CheckCircle, AlertCircle, Clock, Play, X } from "lucide-react";

interface BatchData {
  id: string;
  examName: string;
  uploadDate: string;
  status: 'Processing' | 'Completed' | 'Flagged';
  totalSheets: number;
  completedSheets: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [metrics, setMetrics] = useState({
    totalBatches: 0,
    processingBatches: 0,
    completedBatches: 0,
    flaggedSheets: 0
  });
  
  // Upload states
  const [files, setFiles] = useState<File[]>([]);
  const [questionSet, setQuestionSet] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const mockBatches: BatchData[] = [
      {
        id: "batch-001",
        examName: "Mathematics Final Exam 2024",
        uploadDate: "2024-03-15",
        status: "Completed",
        totalSheets: 120,
        completedSheets: 120
      },
      {
        id: "batch-002",
        examName: "Physics Midterm Test",
        uploadDate: "2024-03-14",
        status: "Processing",
        totalSheets: 85,
        completedSheets: 45
      },
      {
        id: "batch-003",
        examName: "Chemistry Quiz Set A",
        uploadDate: "2024-03-13",
        status: "Flagged",
        totalSheets: 60,
        completedSheets: 58
      }
    ];

    setTimeout(() => {
      setBatches(mockBatches);
      setMetrics({
        totalBatches: mockBatches.length,
        processingBatches: mockBatches.filter(b => b.status === 'Processing').length,
        completedBatches: mockBatches.filter(b => b.status === 'Completed').length,
        flaggedSheets: mockBatches.reduce((sum, b) => sum + (b.status === 'Flagged' ? b.totalSheets - b.completedSheets : 0), 0)
      });
    }, 800);
  }, []);

  // Upload handlers
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

  const handleUpload = async () => {
    if (!questionSet || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select question set and upload files",
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
      
      // Reset form
      setFiles([]);
      setQuestionSet("");
      setIsUploading(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'Processing': return 'bg-processing text-processing-foreground';
      case 'Flagged': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Flagged': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">OMR Evaluation Platform</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate("/workflow-demo")}
              variant="outline"
              size="sm"
              className="text-xs md:text-sm"
            >
              <Play className="w-4 h-4 mr-1 md:mr-2" />
              View Workflow
            </Button>
            <Button 
              onClick={() => navigate("/upload")}
              variant="gradient"
              size="sm"
              className="text-xs md:text-sm"
            >
              <Upload className="w-4 h-4 mr-1 md:mr-2" />
              Full Upload Page
            </Button>
          </div>
        </div>

        {/* Main Content Grid - Upload Section and Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Upload Section - Half Page */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Upload Card */}
            <Card className="shadow-lg animate-slide-up">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Quick Upload OMR Sheets</CardTitle>
                <p className="text-sm text-muted-foreground">Upload PDF files and select question set</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Set Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Question Set</label>
                  <Select value={questionSet} onValueChange={setQuestionSet}>
                    <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
                      <SelectValue placeholder="Select question set (A/B/C/D)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="set-a">Set A</SelectItem>
                      <SelectItem value="set-b">Set B</SelectItem>
                      <SelectItem value="set-c">Set C</SelectItem>
                      <SelectItem value="set-d">Set D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-primary bg-primary/5 shadow-glow' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <Upload className="w-8 md:w-12 h-8 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">Drop PDF files here</h3>
                  <p className="text-sm text-muted-foreground mb-3 md:mb-4">or</p>
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer text-xs md:text-sm">
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

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground">Selected Files ({files.length})</h4>
                    <div className="space-y-2 max-h-32 md:max-h-48 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg animate-bounce-in text-xs md:text-sm"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive p-1 h-auto"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  variant="gradient"
                  className="w-full transition-all duration-300"
                  disabled={isUploading || files.length === 0 || !questionSet}
                  size="sm"
                >
                  {isUploading ? "Processing Upload..." : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Section - Half Page */}
          <div className="space-y-4 md:space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 animate-slide-up">
              <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Batches</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{metrics.totalBatches}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-processing/10 rounded-lg">
                      <Clock className="w-4 md:w-5 h-4 md:h-5 text-processing" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{metrics.processingBatches}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{metrics.completedBatches}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Flagged Sheets</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{metrics.flaggedSheets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Batches */}
            <Card className="animate-scale-in shadow-lg">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-base md:text-lg">Recent Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {batches.map((batch, index) => (
                    <div 
                      key={batch.id}
                      className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate(`/results/${batch.id}`)}
                    >
                      <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                        <div className="p-1.5 md:p-2 bg-primary/10 rounded">
                          <FileText className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm md:text-base text-foreground truncate">{batch.examName}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(batch.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-medium">
                            {batch.completedSheets}/{batch.totalSheets}
                          </p>
                          <div className="w-16 md:w-20 h-1.5 md:h-2 bg-muted rounded-full mt-1">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${(batch.completedSheets / batch.totalSheets) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(batch.status)} text-xs`}>
                          {getStatusIcon(batch.status)}
                          <span className="ml-1 hidden sm:inline">{batch.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;