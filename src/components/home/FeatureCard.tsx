import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  variant: 'coral' | 'magenta' | 'yellow';
  stats?: string;
}

const variantClasses = {
  coral: {
    icon: "text-[hsl(var(--brand-coral))]",
    badge: "bg-[hsl(var(--brand-coral))]/10 text-[hsl(var(--brand-coral))] border-[hsl(var(--brand-coral))]/20",
    button: "bg-[hsl(var(--brand-coral))] hover:bg-[hsl(var(--brand-coral))]/90 text-white",
    shadow: "hover:shadow-[0_8px_32px_-4px_hsl(var(--brand-coral)/0.15)]",
  },
  magenta: {
    icon: "text-[hsl(var(--brand-magenta))]",
    badge: "bg-[hsl(var(--brand-magenta))]/10 text-[hsl(var(--brand-magenta))] border-[hsl(var(--brand-magenta))]/20",
    button: "bg-[hsl(var(--brand-magenta))] hover:bg-[hsl(var(--brand-magenta))]/90 text-white",
    shadow: "hover:shadow-[0_8px_32px_-4px_hsl(var(--brand-magenta)/0.15)]",
  },
  yellow: {
    icon: "text-[hsl(var(--brand-yellow))]",
    badge: "bg-[hsl(var(--brand-yellow))]/10 text-[hsl(var(--brand-yellow))] border-[hsl(var(--brand-yellow))]/20",
    button: "bg-[hsl(var(--brand-yellow))] hover:bg-[hsl(var(--brand-yellow))]/90 text-foreground",
    shadow: "hover:shadow-[0_8px_32px_-4px_hsl(var(--brand-yellow)/0.15)]",
  },
};

export function FeatureCard({
  icon,
  title,
  description,
  features,
  buttonText,
  buttonLink,
  variant,
  stats,
}: FeatureCardProps) {
  const classes = variantClasses[variant];

  return (
    <Card className={`p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] ${classes.shadow}`}>
      <CardHeader className="space-y-4 p-0 mb-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 ${classes.icon}`}>
          {icon}
        </div>
        <div>
          <CardTitle className="text-2xl md:text-3xl mb-2">{title}</CardTitle>
          {stats && (
            <Badge variant="outline" className={classes.badge}>
              {stats}
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 mb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${classes.icon}`} />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-0">
        <Link to={buttonLink} className="w-full">
          <Button className={`w-full ${classes.button}`}>
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
