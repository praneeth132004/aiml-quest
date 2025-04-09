
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const ClassDiagramPage = () => {
  const [activeTab, setActiveTab] = useState("entities");

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Application Architecture</h1>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This diagram provides a visual representation of the application's structure and relationships between components.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="entities" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="entities">Data Entities</TabsTrigger>
            <TabsTrigger value="components">UI Components</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entities" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Entities</CardTitle>
                <CardDescription>Database tables and their relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border p-4 bg-white rounded-lg overflow-auto">
                  <img 
                    src="/entity-diagram.svg" 
                    alt="Entity Relationship Diagram" 
                    className="mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f8f9fa' width='800' height='600'/%3E%3Cg fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='50' y='50' width='200' height='120' rx='10' ry='10' fill='%23e9ecef'/%3E%3Ctext x='150' y='100' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23212529'%3EUsers/Profiles%3C/text%3E%3Crect x='550' y='50' width='200' height='120' rx='10' ry='10' fill='%23e9ecef'/%3E%3Ctext x='650' y='100' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23212529'%3EPosts%3C/text%3E%3Crect x='300' y='250' width='200' height='120' rx='10' ry='10' fill='%23e9ecef'/%3E%3Ctext x='400' y='300' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23212529'%3EPost Votes%3C/text%3E%3Crect x='550' y='250' width='200' height='120' rx='10' ry='10' fill='%23e9ecef'/%3E%3Ctext x='650' y='300' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23212529'%3ESaved Posts%3C/text%3E%3Cpath d='M250 110 L550 110' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M550 170 L400 250' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M650 170 L650 250' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M150 170 L300 300' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M150 170 L550 300' stroke-width='2' marker-end='url(%23arrow)'/%3E%3C/g%3E%3Cdefs%3E%3Cmarker id='arrow' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'%3E%3Cpath d='M0,0 L0,6 L9,3 z' fill='%23999'/%3E%3C/marker%3E%3C/defs%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mt-6 text-sm">
                    <ul className="space-y-2">
                      <li><strong>Users/Profiles:</strong> Stores user information and preferences</li>
                      <li><strong>Posts:</strong> Community discussions created by users</li>
                      <li><strong>Post Votes:</strong> Tracks upvotes and downvotes on posts</li>
                      <li><strong>Saved Posts:</strong> Allows users to bookmark posts for later reference</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>Reusable UI elements and their relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border p-4 bg-white rounded-lg overflow-auto">
                  <img 
                    src="/component-diagram.svg" 
                    alt="Component Diagram" 
                    className="mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f8f9fa' width='800' height='600'/%3E%3Cg fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='300' y='50' width='200' height='80' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='400' y='90' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EPageLayout%3C/text%3E%3Crect x='50' y='200' width='200' height='80' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='150' y='240' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3ENavbar%3C/text%3E%3Crect x='300' y='200' width='200' height='80' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='400' y='240' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EPage Content%3C/text%3E%3Crect x='550' y='200' width='200' height='80' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='650' y='240' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EFooter%3C/text%3E%3Crect x='50' y='350' width='120' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='110' y='380' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23212529'%3EPostCard%3C/text%3E%3Crect x='200' y='350' width='120' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='260' y='380' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23212529'%3ERoadmapCard%3C/text%3E%3Crect x='350' y='350' width='120' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='410' y='380' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23212529'%3EQuizCard%3C/text%3E%3Crect x='500' y='350' width='120' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='560' y='380' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23212529'%3EUI Components%3C/text%3E%3Cpath d='M400 130 L150 200' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 130 L400 200' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 130 L650 200' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 280 L110 350' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 280 L260 350' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 280 L410 350' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 280 L560 350' stroke-width='2' marker-end='url(%23arrow)'/%3E%3C/g%3E%3Cdefs%3E%3Cmarker id='arrow' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'%3E%3Cpath d='M0,0 L0,6 L9,3 z' fill='%23999'/%3E%3C/marker%3E%3C/defs%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mt-6 text-sm">
                    <ul className="space-y-2">
                      <li><strong>PageLayout:</strong> Main layout wrapper used by all pages</li>
                      <li><strong>Navbar:</strong> Navigation component used across the app</li>
                      <li><strong>PostCard:</strong> Displays individual posts in the community section</li>
                      <li><strong>RoadmapCard:</strong> Shows learning roadmap items</li>
                      <li><strong>QuizCard:</strong> Displays quiz information</li>
                      <li><strong>UI Components:</strong> Shadcn components for buttons, cards, etc.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>Application pages and their relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border p-4 bg-white rounded-lg overflow-auto">
                  <img 
                    src="/pages-diagram.svg" 
                    alt="Pages Diagram" 
                    className="mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f8f9fa' width='800' height='600'/%3E%3Cg fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='300' y='50' width='200' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='400' y='85' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EApp%3C/text%3E%3Crect x='50' y='160' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='125' y='195' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EIndex%3C/text%3E%3Crect x='250' y='160' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='325' y='195' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EAuthPage%3C/text%3E%3Crect x='450' y='160' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='525' y='195' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EOnboardingPage%3C/text%3E%3Crect x='650' y='160' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='725' y='195' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3ERoadmapPage%3C/text%3E%3Crect x='50' y='270' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='125' y='305' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EQuizzesPage%3C/text%3E%3Crect x='250' y='270' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='325' y='305' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3ECommunityPage%3C/text%3E%3Crect x='450' y='270' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='525' y='305' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3ECreatePostPage%3C/text%3E%3Crect x='650' y='270' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='725' y='305' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3EPostPage%3C/text%3E%3Crect x='650' y='380' width='150' height='60' rx='5' ry='5' fill='%23e2e8f0'/%3E%3Ctext x='725' y='415' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23212529'%3ENotFound%3C/text%3E%3Cpath d='M400 110 L125 160' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L325 160' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L525 160' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L725 160' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L125 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L325 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L525 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L725 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M400 110 L725 380' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M325 330 L525 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3Cpath d='M525 330 L725 270' stroke-width='2' marker-end='url(%23arrow)'/%3E%3C/g%3E%3Cdefs%3E%3Cmarker id='arrow' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'%3E%3Cpath d='M0,0 L0,6 L9,3 z' fill='%23999'/%3E%3C/marker%3E%3C/defs%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mt-6 text-sm">
                    <ul className="space-y-2">
                      <li><strong>App:</strong> Entry point with routing configuration</li>
                      <li><strong>Index:</strong> Home page with hero section and features</li>
                      <li><strong>AuthPage:</strong> User authentication (login/signup)</li>
                      <li><strong>OnboardingPage:</strong> New user onboarding flow</li>
                      <li><strong>RoadmapPage:</strong> Learning roadmap visualization</li>
                      <li><strong>QuizzesPage:</strong> Interactive quizzes for learning</li>
                      <li><strong>CommunityPage:</strong> Community forum listing</li>
                      <li><strong>CreatePostPage:</strong> Create new community posts</li>
                      <li><strong>PostPage:</strong> View individual community posts</li>
                      <li><strong>NotFound:</strong> 404 page for invalid routes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Application Flow</CardTitle>
            <CardDescription>How data flows through the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>This application follows a standard React application architecture:</p>
              <ol>
                <li><strong>Data Layer:</strong> Supabase provides the backend database and authentication services</li>
                <li><strong>Context Layer:</strong> React Context API (AuthContext) manages global state</li>
                <li><strong>Component Layer:</strong> Reusable UI components build the interface</li>
                <li><strong>Page Layer:</strong> Page components handle routing and business logic</li>
              </ol>
              <p>Key data flows:</p>
              <ul>
                <li>User authentication flow: Login/Signup → Auth Context → Protected Routes</li>
                <li>Community posts: Fetch Posts → Render List → View/Create/Edit → Update Database</li>
                <li>User interactions: UI Events → State Updates → Database Operations → UI Updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ClassDiagramPage;
