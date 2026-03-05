import { Link, useLocation } from "wouter";
import { Users, LayoutDashboard, Building2, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Directory", icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-border bg-card shadow-sm z-10 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="w-6 h-6" />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">HRMS<span className="text-primary">Lite</span></span>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "opacity-70"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar className="w-8 h-8 border border-primary/20">
              <AvatarFallback className="bg-primary/5 text-primary text-xs">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Admin User</span>
              <span className="text-xs text-muted-foreground">HR Department</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="w-5 h-5" />
            <span className="font-display font-bold text-lg text-foreground">HRMS<span className="text-primary">Lite</span></span>
          </div>
          <Avatar className="w-8 h-8 border border-primary/20">
            <AvatarFallback className="bg-primary/5 text-primary text-xs">AD</AvatarFallback>
          </Avatar>
        </header>

        {/* Topbar for Desktop */}
        <header className="h-16 hidden md:flex items-center justify-between px-8 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-0">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
