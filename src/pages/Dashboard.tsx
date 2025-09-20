import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, AlertCircle, Clock, Play } from "lucide-react";

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
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [metrics, setMetrics] = useState({
    totalBatches: 0,
    processingBatches: 0,
    completedBatches: 0,
    flaggedSheets: 0
  });

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">OMR Evaluation Platform</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/workflow-demo")}
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              View Workflow
            </Button>
            <Button 
              onClick={() => navigate("/upload")}
              variant="gradient"
            >
              <Upload className="w-4 h-4 mr-2" />
              New Upload
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
          <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Batches</p>
                  <p className="text-2xl font-bold text-foreground">{metrics.totalBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-processing/10 rounded-lg">
                  <Clock className="w-6 h-6 text-processing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-foreground">{metrics.processingBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{metrics.completedBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flagged Sheets</p>
                  <p className="text-2xl font-bold text-foreground">{metrics.flaggedSheets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <Card className="animate-scale-in shadow-lg">
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batches.map((batch, index) => (
                <div 
                  key={batch.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/results/${batch.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{batch.examName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {new Date(batch.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {batch.completedSheets}/{batch.totalSheets} sheets
                      </p>
                      <div className="w-24 h-2 bg-muted rounded-full mt-1">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all duration-500 animate-progress"
                          style={{ width: `${(batch.completedSheets / batch.totalSheets) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Badge className={getStatusColor(batch.status)}>
                      {getStatusIcon(batch.status)}
                      <span className="ml-1">{batch.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;