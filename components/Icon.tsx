import React from 'react';
import { 
  Terminal, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Cpu, 
  X, 
  Minus, 
  Square, 
  MessageCircle,
  Search,
  Wifi,
  WifiOff,
  Lock,
  Battery,
  BatteryCharging,
  Volume,
  Volume1,
  Volume2,
  ShoppingBag,
  Star,
  Download,
  Palette,
  Music,
  Gamepad2,
  CheckSquare,
  Map,
  Check,
  Youtube,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  VolumeX,
  Power,
  RotateCw,
  Globe,
  Film,
  Clock,
  Plus,
  Zap,
  Leaf,
  Gauge,
  Trash2,
  Share2,
  Smartphone,
  Laptop,
  Tablet
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const props = { size, className };

  switch (name) {
    case 'Terminal': return <Terminal {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'Image': return <ImageIcon {...props} />;
    case 'Settings': return <Settings {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'X': return <X {...props} />;
    case 'Minus': return <Minus {...props} />;
    case 'Square': return <Square {...props} />;
    case 'MessageCircle': return <MessageCircle {...props} />;
    case 'Search': return <Search {...props} />;
    case 'Wifi': return <Wifi {...props} />;
    case 'WifiOff': return <WifiOff {...props} />;
    case 'Lock': return <Lock {...props} />;
    case 'Battery': return <Battery {...props} />;
    case 'BatteryCharging': return <BatteryCharging {...props} />;
    case 'Volume': return <Volume {...props} />;
    case 'Volume1': return <Volume1 {...props} />;
    case 'Volume2': return <Volume2 {...props} />;
    case 'VolumeX': return <VolumeX {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Download': return <Download {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Gamepad2': return <Gamepad2 {...props} />;
    case 'CheckSquare': return <CheckSquare {...props} />;
    case 'Map': return <Map {...props} />;
    case 'Check': return <Check {...props} />;
    case 'Youtube': return <Youtube {...props} />;
    case 'Play': return <Play {...props} />;
    case 'Pause': return <Pause {...props} />;
    case 'SkipBack': return <SkipBack {...props} />;
    case 'SkipForward': return <SkipForward {...props} />;
    case 'Maximize': return <Maximize {...props} />;
    case 'Minimize': return <Minimize {...props} />;
    case 'Power': return <Power {...props} />;
    case 'RotateCw': return <RotateCw {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'Film': return <Film {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'Plus': return <Plus {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Leaf': return <Leaf {...props} />;
    case 'Gauge': return <Gauge {...props} />;
    case 'Trash2': return <Trash2 {...props} />;
    case 'Share2': return <Share2 {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'Tablet': return <Tablet {...props} />;
    default: return <div style={{ width: size, height: size }} className={className} />;
  }
};