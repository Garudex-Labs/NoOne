import type { IconProps } from '@tabler/icons-react'
import {
  IconActivity as VendorIconActivity,
  IconAdjustmentsHorizontal as VendorIconAdjustmentsHorizontal,
  IconAlertCircle as VendorIconAlertCircle,
  IconAlertTriangle as VendorIconAlertTriangle,
  IconAlignLeft as VendorIconAlignLeft,
  IconAppWindow as VendorIconAppWindow,
  IconArchive as VendorIconArchive,
  IconArchiveOff as VendorIconArchiveOff,
  IconArrowBarToDown as VendorIconArrowBarToDown,
  IconArrowBarToUp as VendorIconArrowBarToUp,
  IconArrowDown as VendorIconArrowDown,
  IconArrowLeft as VendorIconArrowLeft,
  IconArrowRight as VendorIconArrowRight,
  IconArrowsSort as VendorIconArrowsSort,
  IconArrowUp as VendorIconArrowUp,
  IconArrowUpRight as VendorIconArrowUpRight,
  IconAt as VendorIconAt,
  IconBell as VendorIconBell,
  IconBellOff as VendorIconBellOff,
  IconBolt as VendorIconBolt,
  IconBoltFilled as VendorIconBoltFilled,
  IconBook as VendorIconBook,
  IconBook2 as VendorIconBook2,
  IconBookmark as VendorIconBookmark,
  IconBookmarkFilled as VendorIconBookmarkFilled,
  IconBox as VendorIconBox,
  IconBrain as VendorIconBrain,
  IconBrandSlack as VendorIconBrandSlack,
  IconBrush as VendorIconBrush,
  IconBug as VendorIconBug,
  IconBulb as VendorIconBulb,
  IconCalendar as VendorIconCalendar,
  IconCamera as VendorIconCamera,
  IconCategory as VendorIconCategory,
  IconChartBar as VendorIconChartBar,
  IconChartDots3 as VendorIconChartDots3,
  IconCheck as VendorIconCheck,
  IconChecks as VendorIconChecks,
  IconChevronDown as VendorIconChevronDown,
  IconChevronLeft as VendorIconChevronLeft,
  IconChevronRight as VendorIconChevronRight,
  IconChevronsDown as VendorIconChevronsDown,
  IconChevronUp as VendorIconChevronUp,
  IconCircle as VendorIconCircle,
  IconCircleCheck as VendorIconCircleCheck,
  IconCircleLetterA as VendorIconCircleLetterA,
  IconCircleOff as VendorIconCircleOff,
  IconClipboard as VendorIconClipboard,
  IconClipboardList as VendorIconClipboardList,
  IconClock as VendorIconClock,
  IconCloud as VendorIconCloud,
  IconCode as VendorIconCode,
  IconCommand as VendorIconCommand,
  IconCopy as VendorIconCopy,
  IconCornerDownLeft as VendorIconCornerDownLeft,
  IconCornerUpLeft as VendorIconCornerUpLeft,
  IconCpu as VendorIconCpu,
  IconCreditCard as VendorIconCreditCard,
  IconCurrencyDollar as VendorIconCurrencyDollar,
  IconDatabase as VendorIconDatabase,
  IconDeviceDesktop as VendorIconDeviceDesktop,
  IconDeviceDesktopAnalytics as VendorIconDeviceDesktopAnalytics,
  IconDeviceFloppy as VendorIconDeviceFloppy,
  IconDeviceSdCard as VendorIconDeviceSdCard,
  IconDots as VendorIconDots,
  IconDotsVertical as VendorIconDotsVertical,
  IconDownload as VendorIconDownload,
  IconEar as VendorIconEar,
  IconEarOff as VendorIconEarOff,
  IconEgg as VendorIconEgg,
  IconEraser as VendorIconEraser,
  IconExternalLink as VendorIconExternalLink,
  IconEye as VendorIconEye,
  IconEyeOff as VendorIconEyeOff,
  IconFile as VendorIconFile,
  IconFileCode as VendorIconFileCode,
  IconFileExport as VendorIconFileExport,
  IconFileMinus as VendorIconFileMinus,
  IconFilePlus as VendorIconFilePlus,
  IconFileText as VendorIconFileText,
  IconFileTypePdf as VendorIconFileTypePdf,
  IconFileUnknown as VendorIconFileUnknown,
  IconFilter as VendorIconFilter,
  IconFilter2 as VendorIconFilter2,
  IconFolder as VendorIconFolder,
  IconFolderCode as VendorIconFolderCode,
  IconFolderOpen as VendorIconFolderOpen,
  IconFolderPlus as VendorIconFolderPlus,
  IconFolders as VendorIconFolders,
  IconForms as VendorIconForms,
  IconGauge as VendorIconGauge,
  IconGitBranch as VendorIconGitBranch,
  IconGitFork as VendorIconGitFork,
  IconGitMerge as VendorIconGitMerge,
  IconGitPullRequest as VendorIconGitPullRequest,
  IconGlobe as VendorIconGlobe,
  IconGripHorizontal as VendorIconGripHorizontal,
  IconGripVertical as VendorIconGripVertical,
  IconHash as VendorIconHash,
  IconHeart as VendorIconHeart,
  IconHelpCircle as VendorIconHelpCircle,
  IconHistory as VendorIconHistory,
  IconHome as VendorIconHome,
  IconInfoCircle as VendorIconInfoCircle,
  IconKey as VendorIconKey,
  IconKeyboard as VendorIconKeyboard,
  IconLayersIntersect2 as VendorIconLayersIntersect2,
  IconLayoutBottombar as VendorIconLayoutBottombar,
  IconLayoutDashboard as VendorIconLayoutDashboard,
  IconLayoutNavbar as VendorIconLayoutNavbar,
  IconLayoutSidebar as VendorIconLayoutSidebar,
  IconLayoutSidebarLeftCollapse as VendorIconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand as VendorIconLayoutSidebarLeftExpand,
  IconLayoutSidebarRight as VendorIconLayoutSidebarRight,
  IconLink as VendorIconLink,
  IconList as VendorIconList,
  IconListCheck as VendorIconListCheck,
  IconListNumbers as VendorIconListNumbers,
  IconListTree as VendorIconListTree,
  IconLoader2 as VendorIconLoader2,
  IconLock as VendorIconLock,
  IconLockOpen as VendorIconLockOpen,
  IconLogin as VendorIconLogin,
  IconLogout as VendorIconLogout,
  IconMail as VendorIconMail,
  IconMaximize as VendorIconMaximize,
  IconMenu2 as VendorIconMenu2,
  IconMessage as VendorIconMessage,
  IconMessage2 as VendorIconMessage2,
  IconMessageCircle as VendorIconMessageCircle,
  IconMessageCode as VendorIconMessageCode,
  IconMessagePlus as VendorIconMessagePlus,
  IconMessageQuestion as VendorIconMessageQuestion,
  IconMicrophone as VendorIconMicrophone,
  IconMicrophoneOff as VendorIconMicrophoneOff,
  IconMinimize as VendorIconMinimize,
  IconMinus as VendorIconMinus,
  IconMoodPlus as VendorIconMoodPlus,
  IconMoon as VendorIconMoon,
  IconNetwork as VendorIconNetwork,
  IconNotebook as VendorIconNotebook,
  IconPackage as VendorIconPackage,
  IconPackages as VendorIconPackages,
  IconPalette as VendorIconPalette,
  IconPaperclip as VendorIconPaperclip,
  IconPaw as VendorIconPaw,
  IconPencil as VendorIconPencil,
  IconPhoto as VendorIconPhoto,
  IconPin as VendorIconPin,
  IconPlayerEjectFilled as VendorIconPlayerEjectFilled,
  IconPlayerPause as VendorIconPlayerPause,
  IconPlayerPlay as VendorIconPlayerPlay,
  IconPlayerStopFilled as VendorIconPlayerStopFilled,
  IconPlug as VendorIconPlug,
  IconPlugConnected as VendorIconPlugConnected,
  IconPlus as VendorIconPlus,
  IconPower as VendorIconPower,
  IconPuzzle as VendorIconPuzzle,
  IconQrcode as VendorIconQrcode,
  IconRadio as VendorIconRadio,
  IconRefresh as VendorIconRefresh,
  IconRobot as VendorIconRobot,
  IconRosetteDiscountCheck as VendorIconRosetteDiscountCheck,
  IconRotate2 as VendorIconRotate2,
  IconRotateClockwise2 as VendorIconRotateClockwise2,
  IconRoute as VendorIconRoute,
  IconSearch as VendorIconSearch,
  IconSend as VendorIconSend,
  IconServer as VendorIconServer,
  IconSettings as VendorIconSettings,
  IconSettings2 as VendorIconSettings2,
  IconShare as VendorIconShare,
  IconShield as VendorIconShield,
  IconShieldCheck as VendorIconShieldCheck,
  IconShieldExclamation as VendorIconShieldExclamation,
  IconShieldLock as VendorIconShieldLock,
  IconShieldOff as VendorIconShieldOff,
  IconShieldQuestion as VendorIconShieldQuestion,
  IconSparkles as VendorIconSparkles,
  IconSquare as VendorIconSquare,
  IconStar as VendorIconStar,
  IconStarFilled as VendorIconStarFilled,
  IconSteeringWheel as VendorIconSteeringWheel,
  IconStethoscope as VendorIconStethoscope,
  IconSun as VendorIconSun,
  IconTarget as VendorIconTarget,
  IconTerminal2 as VendorIconTerminal2,
  IconTool as VendorIconTool,
  IconTrash as VendorIconTrash,
  IconTrendingUp as VendorIconTrendingUp,
  IconTypography as VendorIconTypography,
  IconUnlink as VendorIconUnlink,
  IconUpload as VendorIconUpload,
  IconUser as VendorIconUser,
  IconUsers as VendorIconUsers,
  IconVolume2 as VendorIconVolume2,
  IconVolumeOff as VendorIconVolumeOff,
  IconWand as VendorIconWand,
  IconWaveSine as VendorIconWaveSine,
  IconWebhook as VendorIconWebhook,
  IconWifi as VendorIconWifi,
  IconWifiOff as VendorIconWifiOff,
  IconWindowMaximize as VendorIconWindowMaximize,
  IconX as VendorIconX,
  IconZoomIn as VendorIconZoomIn,
  IconZoomOut as VendorIconZoomOut,
} from '@tabler/icons-react'
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'

export type { IconProps } from '@tabler/icons-react'
export type { Icon as IconComponent } from '@tabler/icons-react'
type SvgIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>

function uiIcon(Component: SvgIcon, name: string): SvgIcon {
  const Wrapped = forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
    <Component
      aria-hidden={props.title || props.role || props['aria-label'] || props['aria-labelledby'] ? undefined : true}
      className={['noone-icon', className].filter(Boolean).join(' ')}
      ref={ref}
      size={16}
      {...props}
    />
  ))

  Wrapped.displayName = name

  return Wrapped
}

export const Activity = /* @__PURE__ */ uiIcon(VendorIconActivity, 'Activity')
export const AlertCircle = /* @__PURE__ */ uiIcon(VendorIconAlertCircle, 'AlertCircle')
export const AlertTriangle = /* @__PURE__ */ uiIcon(VendorIconAlertTriangle, 'AlertTriangle')
export const AlignLeft = /* @__PURE__ */ uiIcon(VendorIconAlignLeft, 'AlignLeft')
export const AppWindow = /* @__PURE__ */ uiIcon(VendorIconAppWindow, 'AppWindow')
export const Archive = /* @__PURE__ */ uiIcon(VendorIconArchive, 'Archive')
export const ArchiveOff = /* @__PURE__ */ uiIcon(VendorIconArchiveOff, 'ArchiveOff')
export const ArrowBarToDown = /* @__PURE__ */ uiIcon(VendorIconArrowBarToDown, 'ArrowBarToDown')
export const ArrowBarToUp = /* @__PURE__ */ uiIcon(VendorIconArrowBarToUp, 'ArrowBarToUp')
export const ArrowDown = /* @__PURE__ */ uiIcon(VendorIconArrowDown, 'ArrowDown')
export const ArrowLeft = /* @__PURE__ */ uiIcon(VendorIconArrowLeft, 'ArrowLeft')
export const ArrowRight = /* @__PURE__ */ uiIcon(VendorIconArrowRight, 'ArrowRight')
export const ArrowUp = /* @__PURE__ */ uiIcon(VendorIconArrowUp, 'ArrowUp')
export const ArrowUpDown = /* @__PURE__ */ uiIcon(VendorIconArrowsSort, 'ArrowUpDown')
export const ArrowUpRight = /* @__PURE__ */ uiIcon(VendorIconArrowUpRight, 'ArrowUpRight')
export const AtSign = /* @__PURE__ */ uiIcon(VendorIconAt, 'AtSign')
export const AudioLines = /* @__PURE__ */ uiIcon(VendorIconWaveSine, 'AudioLines')
export const BarChart3 = /* @__PURE__ */ uiIcon(VendorIconChartBar, 'BarChart3')
export const Bell = /* @__PURE__ */ uiIcon(VendorIconBell, 'Bell')
export const BellOff = /* @__PURE__ */ uiIcon(VendorIconBellOff, 'BellOff')
export const Blocks = /* @__PURE__ */ uiIcon(VendorIconPackages, 'Blocks')
export const Book = /* @__PURE__ */ uiIcon(VendorIconBook, 'Book')
export const BookOpen = /* @__PURE__ */ uiIcon(VendorIconBook2, 'BookOpen')
export const Bookmark = /* @__PURE__ */ uiIcon(VendorIconBookmark, 'Bookmark')
export const BookmarkFilled = /* @__PURE__ */ uiIcon(VendorIconBookmarkFilled, 'BookmarkFilled')
export const Bot = /* @__PURE__ */ uiIcon(VendorIconRobot, 'Bot')
export const Box = /* @__PURE__ */ uiIcon(VendorIconBox, 'Box')
export const Brain = /* @__PURE__ */ uiIcon(VendorIconBrain, 'Brain')
export const Bug = /* @__PURE__ */ uiIcon(VendorIconBug, 'Bug')
export const Calendar = /* @__PURE__ */ uiIcon(VendorIconCalendar, 'Calendar')
export const Camera = /* @__PURE__ */ uiIcon(VendorIconCamera, 'Camera')
export const Check = /* @__PURE__ */ uiIcon(VendorIconCheck, 'Check')
export const CheckAll = /* @__PURE__ */ uiIcon(VendorIconChecks, 'CheckAll')
export const CheckCircle2 = /* @__PURE__ */ uiIcon(VendorIconCircleCheck, 'CheckCircle2')
export const CheckIcon = /* @__PURE__ */ uiIcon(VendorIconCheck, 'CheckIcon')
export const ChevronDown = /* @__PURE__ */ uiIcon(VendorIconChevronDown, 'ChevronDown')
export const ChevronDownIcon = /* @__PURE__ */ uiIcon(VendorIconChevronDown, 'ChevronDownIcon')
export const ChevronLeft = /* @__PURE__ */ uiIcon(VendorIconChevronLeft, 'ChevronLeft')
export const ChevronLeftIcon = /* @__PURE__ */ uiIcon(VendorIconChevronLeft, 'ChevronLeftIcon')
export const ChevronRight = /* @__PURE__ */ uiIcon(VendorIconChevronRight, 'ChevronRight')
export const ChevronRightIcon = /* @__PURE__ */ uiIcon(VendorIconChevronRight, 'ChevronRightIcon')
export const ChevronUp = /* @__PURE__ */ uiIcon(VendorIconChevronUp, 'ChevronUp')
export const ChevronsDown = /* @__PURE__ */ uiIcon(VendorIconChevronsDown, 'ChevronsDown')
export const Circle = /* @__PURE__ */ uiIcon(VendorIconCircle, 'Circle')
export const CircleIcon = /* @__PURE__ */ uiIcon(VendorIconCircle, 'CircleIcon')
export const CircleLetterA = /* @__PURE__ */ uiIcon(VendorIconCircleLetterA, 'CircleLetterA')
export const CircleOff = /* @__PURE__ */ uiIcon(VendorIconCircleOff, 'CircleOff')
export const Clipboard = /* @__PURE__ */ uiIcon(VendorIconClipboard, 'Clipboard')
export const ClipboardList = /* @__PURE__ */ uiIcon(VendorIconClipboardList, 'ClipboardList')
export const Clock = /* @__PURE__ */ uiIcon(VendorIconClock, 'Clock')
export const Cloud = /* @__PURE__ */ uiIcon(VendorIconCloud, 'Cloud')
export const Code = /* @__PURE__ */ uiIcon(VendorIconCode, 'Code')
export const Command = /* @__PURE__ */ uiIcon(VendorIconCommand, 'Command')
export const Copy = /* @__PURE__ */ uiIcon(VendorIconCopy, 'Copy')
export const CopyIcon = /* @__PURE__ */ uiIcon(VendorIconCopy, 'CopyIcon')
export const CornerDownLeft = /* @__PURE__ */ uiIcon(VendorIconCornerDownLeft, 'CornerDownLeft')
export const Cpu = /* @__PURE__ */ uiIcon(VendorIconCpu, 'Cpu')
export const CreditCard = /* @__PURE__ */ uiIcon(VendorIconCreditCard, 'CreditCard')
export const Database = /* @__PURE__ */ uiIcon(VendorIconDatabase, 'Database')
export const DollarSign = /* @__PURE__ */ uiIcon(VendorIconCurrencyDollar, 'DollarSign')
export const Download = /* @__PURE__ */ uiIcon(VendorIconDownload, 'Download')
export const Ear = /* @__PURE__ */ uiIcon(VendorIconEar, 'Ear')
export const EarOff = /* @__PURE__ */ uiIcon(VendorIconEarOff, 'EarOff')
export const Egg = /* @__PURE__ */ uiIcon(VendorIconEgg, 'Egg')
export const Eject = /* @__PURE__ */ uiIcon(VendorIconPlayerEjectFilled, 'Eject')
export const Eraser = /* @__PURE__ */ uiIcon(VendorIconEraser, 'Eraser')
export const ExternalLink = /* @__PURE__ */ uiIcon(VendorIconExternalLink, 'ExternalLink')
export const Eye = /* @__PURE__ */ uiIcon(VendorIconEye, 'Eye')
export const EyeOff = /* @__PURE__ */ uiIcon(VendorIconEyeOff, 'EyeOff')
export const File = /* @__PURE__ */ uiIcon(VendorIconFile, 'File')
export const FileCode = /* @__PURE__ */ uiIcon(VendorIconFileCode, 'FileCode')
export const FileIcon = /* @__PURE__ */ uiIcon(VendorIconFile, 'FileIcon')
export const FileImage = /* @__PURE__ */ uiIcon(VendorIconPhoto, 'FileImage')
export const FileMinus = /* @__PURE__ */ uiIcon(VendorIconFileMinus, 'FileMinus')
export const FileOutput = /* @__PURE__ */ uiIcon(VendorIconFileExport, 'FileOutput')
export const FilePdf = /* @__PURE__ */ uiIcon(VendorIconFileTypePdf, 'FilePdf')
export const FilePlus = /* @__PURE__ */ uiIcon(VendorIconFilePlus, 'FilePlus')
export const FileQuestion = /* @__PURE__ */ uiIcon(VendorIconFileUnknown, 'FileQuestion')
export const FileText = /* @__PURE__ */ uiIcon(VendorIconFileText, 'FileText')
export const Filter = /* @__PURE__ */ uiIcon(VendorIconFilter, 'Filter')
export const Folder = /* @__PURE__ */ uiIcon(VendorIconFolder, 'Folder')
export const FolderGit2 = /* @__PURE__ */ uiIcon(VendorIconFolderCode, 'FolderGit2')
export const FolderLibrary = /* @__PURE__ */ uiIcon(VendorIconFolders, 'FolderLibrary')
export const FolderOpen = /* @__PURE__ */ uiIcon(VendorIconFolderOpen, 'FolderOpen')
export const FolderPlus = /* @__PURE__ */ uiIcon(VendorIconFolderPlus, 'FolderPlus')
export const FormInput = /* @__PURE__ */ uiIcon(VendorIconForms, 'FormInput')
export const Gauge = /* @__PURE__ */ uiIcon(VendorIconGauge, 'Gauge')
export const GitBranch = /* @__PURE__ */ uiIcon(VendorIconGitBranch, 'GitBranch')
export const GitBranchIcon = /* @__PURE__ */ uiIcon(VendorIconGitBranch, 'GitBranchIcon')
export const GitFork = /* @__PURE__ */ uiIcon(VendorIconGitFork, 'GitFork')
export const GitForkIcon = /* @__PURE__ */ uiIcon(VendorIconGitFork, 'GitForkIcon')
export const GitMerge = /* @__PURE__ */ uiIcon(VendorIconGitMerge, 'GitMerge')
export const GitPullRequest = /* @__PURE__ */ uiIcon(VendorIconGitPullRequest, 'GitPullRequest')
export const Globe = /* @__PURE__ */ uiIcon(VendorIconGlobe, 'Globe')
export const GripHorizontal = /* @__PURE__ */ uiIcon(VendorIconGripHorizontal, 'GripHorizontal')
export const GripVertical = /* @__PURE__ */ uiIcon(VendorIconGripVertical, 'GripVertical')
export const HardDrive = /* @__PURE__ */ uiIcon(VendorIconDeviceSdCard, 'HardDrive')
export const Hash = /* @__PURE__ */ uiIcon(VendorIconHash, 'Hash')
export const Heart = /* @__PURE__ */ uiIcon(VendorIconHeart, 'Heart')
export const HelpCircle = /* @__PURE__ */ uiIcon(VendorIconHelpCircle, 'HelpCircle')
export const History = /* @__PURE__ */ uiIcon(VendorIconHistory, 'History')
export const Home = /* @__PURE__ */ uiIcon(VendorIconHome, 'Home')
export const IconBrandSlack = /* @__PURE__ */ uiIcon(VendorIconBrandSlack, 'IconBrandSlack')
export const IconCategory = /* @__PURE__ */ uiIcon(VendorIconCategory, 'IconCategory')
export const IconDatabase = /* @__PURE__ */ uiIcon(VendorIconDatabase, 'IconDatabase')
export const IconFilter2 = /* @__PURE__ */ uiIcon(VendorIconFilter2, 'IconFilter2')
export const IconRosetteDiscountCheck = /* @__PURE__ */ uiIcon(VendorIconRosetteDiscountCheck, 'IconRosetteDiscountCheck')
export const ImageIcon = /* @__PURE__ */ uiIcon(VendorIconPhoto, 'ImageIcon')
export const Info = /* @__PURE__ */ uiIcon(VendorIconInfoCircle, 'Info')
export const KeyRound = /* @__PURE__ */ uiIcon(VendorIconKey, 'KeyRound')
export const Keyboard = /* @__PURE__ */ uiIcon(VendorIconKeyboard, 'Keyboard')
export const Layers3 = /* @__PURE__ */ uiIcon(VendorIconLayersIntersect2, 'Layers3')
export const LayoutDashboard = /* @__PURE__ */ uiIcon(VendorIconLayoutDashboard, 'LayoutDashboard')
export const Lightbulb = /* @__PURE__ */ uiIcon(VendorIconBulb, 'Lightbulb')
export const Link = /* @__PURE__ */ uiIcon(VendorIconLink, 'Link')
export const Link2 = /* @__PURE__ */ uiIcon(VendorIconLink, 'Link2')
export const LinkIcon = /* @__PURE__ */ uiIcon(VendorIconLink, 'LinkIcon')
export const List = /* @__PURE__ */ uiIcon(VendorIconList, 'List')
export const ListChecks = /* @__PURE__ */ uiIcon(VendorIconListCheck, 'ListChecks')
export const ListFilter = /* @__PURE__ */ uiIcon(VendorIconFilter, 'ListFilter')
export const ListOrdered = /* @__PURE__ */ uiIcon(VendorIconListNumbers, 'ListOrdered')
export const ListTree = /* @__PURE__ */ uiIcon(VendorIconListTree, 'ListTree')
export const Loader2 = /* @__PURE__ */ uiIcon(VendorIconLoader2, 'Loader2')
export const Loader2Icon = /* @__PURE__ */ uiIcon(VendorIconLoader2, 'Loader2Icon')
export const Lock = /* @__PURE__ */ uiIcon(VendorIconLock, 'Lock')
export const LockOpen = /* @__PURE__ */ uiIcon(VendorIconLockOpen, 'LockOpen')
export const LogIn = /* @__PURE__ */ uiIcon(VendorIconLogin, 'LogIn')
export const LogOut = /* @__PURE__ */ uiIcon(VendorIconLogout, 'LogOut')
export const Mail = /* @__PURE__ */ uiIcon(VendorIconMail, 'Mail')
export const Maximize = /* @__PURE__ */ uiIcon(VendorIconMaximize, 'Maximize')
export const Maximize2 = /* @__PURE__ */ uiIcon(VendorIconMaximize, 'Maximize2')
export const Menu = /* @__PURE__ */ uiIcon(VendorIconMenu2, 'Menu')
export const Message = /* @__PURE__ */ uiIcon(VendorIconMessage, 'Message')
export const MessageCircle = /* @__PURE__ */ uiIcon(VendorIconMessageCircle, 'MessageCircle')
export const MessageCode = /* @__PURE__ */ uiIcon(VendorIconMessageCode, 'MessageCode')
export const MessageQuestion = /* @__PURE__ */ uiIcon(VendorIconMessageQuestion, 'MessageQuestion')
export const MessageSquare = /* @__PURE__ */ uiIcon(VendorIconMessage, 'MessageSquare')
export const MessageSquarePlus = /* @__PURE__ */ uiIcon(VendorIconMessagePlus, 'MessageSquarePlus')
export const MessageSquareText = /* @__PURE__ */ uiIcon(VendorIconMessage2, 'MessageSquareText')
export const Mic = /* @__PURE__ */ uiIcon(VendorIconMicrophone, 'Mic')
export const MicOff = /* @__PURE__ */ uiIcon(VendorIconMicrophoneOff, 'MicOff')
export const Microphone = /* @__PURE__ */ uiIcon(VendorIconMicrophone, 'Microphone')
export const Minimize2 = /* @__PURE__ */ uiIcon(VendorIconMinimize, 'Minimize2')
export const Minus = /* @__PURE__ */ uiIcon(VendorIconMinus, 'Minus')
export const Monitor = /* @__PURE__ */ uiIcon(VendorIconDeviceDesktop, 'Monitor')
export const MonitorPlay = /* @__PURE__ */ uiIcon(VendorIconDeviceDesktopAnalytics, 'MonitorPlay')
export const Moon = /* @__PURE__ */ uiIcon(VendorIconMoon, 'Moon')
export const MoreHorizontal = /* @__PURE__ */ uiIcon(VendorIconDots, 'MoreHorizontal')
export const MoreHorizontalIcon = /* @__PURE__ */ uiIcon(VendorIconDots, 'MoreHorizontalIcon')
export const MoreVertical = /* @__PURE__ */ uiIcon(VendorIconDotsVertical, 'MoreVertical')
export const Network = /* @__PURE__ */ uiIcon(VendorIconNetwork, 'Network')
export const NotebookTabs = /* @__PURE__ */ uiIcon(VendorIconNotebook, 'NotebookTabs')
export const Package = /* @__PURE__ */ uiIcon(VendorIconPackage, 'Package')
export const Paintbrush = /* @__PURE__ */ uiIcon(VendorIconBrush, 'Paintbrush')
export const Palette = /* @__PURE__ */ uiIcon(VendorIconPalette, 'Palette')
export const PanelBottom = /* @__PURE__ */ uiIcon(VendorIconLayoutBottombar, 'PanelBottom')
export const PanelLeftClose = /* @__PURE__ */ uiIcon(VendorIconLayoutSidebarLeftCollapse, 'PanelLeftClose')
export const PanelLeftIcon = /* @__PURE__ */ uiIcon(VendorIconLayoutSidebar, 'PanelLeftIcon')
export const PanelLeftOpen = /* @__PURE__ */ uiIcon(VendorIconLayoutSidebarLeftExpand, 'PanelLeftOpen')
export const PanelRight = /* @__PURE__ */ uiIcon(VendorIconLayoutSidebarRight, 'PanelRight')
export const PanelTop = /* @__PURE__ */ uiIcon(VendorIconLayoutNavbar, 'PanelTop')
export const Paperclip = /* @__PURE__ */ uiIcon(VendorIconPaperclip, 'Paperclip')
export const Pause = /* @__PURE__ */ uiIcon(VendorIconPlayerPause, 'Pause')
export const PawPrint = /* @__PURE__ */ uiIcon(VendorIconPaw, 'PawPrint')
export const Pencil = /* @__PURE__ */ uiIcon(VendorIconPencil, 'Pencil')
export const PencilIcon = /* @__PURE__ */ uiIcon(VendorIconPencil, 'PencilIcon')
export const PencilLine = /* @__PURE__ */ uiIcon(VendorIconPencil, 'PencilLine')
export const Pin = /* @__PURE__ */ uiIcon(VendorIconPin, 'Pin')
export const Play = /* @__PURE__ */ uiIcon(VendorIconPlayerPlay, 'Play')
export const Plug = /* @__PURE__ */ uiIcon(VendorIconPlug, 'Plug')
export const PlugZap = /* @__PURE__ */ uiIcon(VendorIconPlugConnected, 'PlugZap')
export const Plus = /* @__PURE__ */ uiIcon(VendorIconPlus, 'Plus')
export const Power = /* @__PURE__ */ uiIcon(VendorIconPower, 'Power')
export const PowerOff = /* @__PURE__ */ uiIcon(VendorIconPower, 'PowerOff')
export const Puzzle = /* @__PURE__ */ uiIcon(VendorIconPuzzle, 'Puzzle')
export const QrCode = /* @__PURE__ */ uiIcon(VendorIconQrcode, 'QrCode')
export const Radio = /* @__PURE__ */ uiIcon(VendorIconRadio, 'Radio')
export const RefreshCw = /* @__PURE__ */ uiIcon(VendorIconRefresh, 'RefreshCw')
export const RefreshCwIcon = /* @__PURE__ */ uiIcon(VendorIconRefresh, 'RefreshCwIcon')
export const Reply = /* @__PURE__ */ uiIcon(VendorIconCornerUpLeft, 'Reply')
export const Robot = /* @__PURE__ */ uiIcon(VendorIconRobot, 'Robot')
export const RotateCcw = /* @__PURE__ */ uiIcon(VendorIconRotate2, 'RotateCcw')
export const RotateCw = /* @__PURE__ */ uiIcon(VendorIconRotateClockwise2, 'RotateCw')
export const Route = /* @__PURE__ */ uiIcon(VendorIconRoute, 'Route')
export const Save = /* @__PURE__ */ uiIcon(VendorIconDeviceFloppy, 'Save')
export const Search = /* @__PURE__ */ uiIcon(VendorIconSearch, 'Search')
export const SearchIcon = /* @__PURE__ */ uiIcon(VendorIconSearch, 'SearchIcon')
export const Send = /* @__PURE__ */ uiIcon(VendorIconSend, 'Send')
export const Server = /* @__PURE__ */ uiIcon(VendorIconServer, 'Server')
export const Settings = /* @__PURE__ */ uiIcon(VendorIconSettings, 'Settings')
export const Settings2 = /* @__PURE__ */ uiIcon(VendorIconSettings2, 'Settings2')
export const Share2 = /* @__PURE__ */ uiIcon(VendorIconShare, 'Share2')
export const Shield = /* @__PURE__ */ uiIcon(VendorIconShield, 'Shield')
export const ShieldAlert = /* @__PURE__ */ uiIcon(VendorIconShieldExclamation, 'ShieldAlert')
export const ShieldCheck = /* @__PURE__ */ uiIcon(VendorIconShieldCheck, 'ShieldCheck')
export const ShieldLock = /* @__PURE__ */ uiIcon(VendorIconShieldLock, 'ShieldLock')
export const ShieldOff = /* @__PURE__ */ uiIcon(VendorIconShieldOff, 'ShieldOff')
export const ShieldQuestion = /* @__PURE__ */ uiIcon(VendorIconShieldQuestion, 'ShieldQuestion')
export const SlidersHorizontal = /* @__PURE__ */ uiIcon(VendorIconAdjustmentsHorizontal, 'SlidersHorizontal')
export const SmilePlusIcon = /* @__PURE__ */ uiIcon(VendorIconMoodPlus, 'SmilePlusIcon')
export const Sparkles = /* @__PURE__ */ uiIcon(VendorIconSparkles, 'Sparkles')
export const Square = /* @__PURE__ */ uiIcon(VendorIconSquare, 'Square')
export const Star = /* @__PURE__ */ uiIcon(VendorIconStar, 'Star')
export const StarFilled = /* @__PURE__ */ uiIcon(VendorIconStarFilled, 'StarFilled')
export const Starmap = /* @__PURE__ */ uiIcon(VendorIconChartDots3, 'Starmap')
export const SteeringWheel = /* @__PURE__ */ uiIcon(VendorIconSteeringWheel, 'SteeringWheel')
export const Stethoscope = /* @__PURE__ */ uiIcon(VendorIconStethoscope, 'Stethoscope')
export const StopFilled = /* @__PURE__ */ uiIcon(VendorIconPlayerStopFilled, 'StopFilled')
export const Sun = /* @__PURE__ */ uiIcon(VendorIconSun, 'Sun')
export const Target = /* @__PURE__ */ uiIcon(VendorIconTarget, 'Target')
export const Terminal = /* @__PURE__ */ uiIcon(VendorIconTerminal2, 'Terminal')
export const Trash2 = /* @__PURE__ */ uiIcon(VendorIconTrash, 'Trash2')
export const TrendingUp = /* @__PURE__ */ uiIcon(VendorIconTrendingUp, 'TrendingUp')
export const Type = /* @__PURE__ */ uiIcon(VendorIconTypography, 'Type')
export const Typography = /* @__PURE__ */ uiIcon(VendorIconTypography, 'Typography')
export const Unlink = /* @__PURE__ */ uiIcon(VendorIconUnlink, 'Unlink')
export const Upload = /* @__PURE__ */ uiIcon(VendorIconUpload, 'Upload')
export const User = /* @__PURE__ */ uiIcon(VendorIconUser, 'User')
export const Users = /* @__PURE__ */ uiIcon(VendorIconUsers, 'Users')
export const Volume2 = /* @__PURE__ */ uiIcon(VendorIconVolume2, 'Volume2')
export const Volume2Icon = /* @__PURE__ */ uiIcon(VendorIconVolume2, 'Volume2Icon')
export const VolumeX = /* @__PURE__ */ uiIcon(VendorIconVolumeOff, 'VolumeX')
export const VolumeXIcon = /* @__PURE__ */ uiIcon(VendorIconVolumeOff, 'VolumeXIcon')
export const Wand2 = /* @__PURE__ */ uiIcon(VendorIconWand, 'Wand2')
export const Webhook = /* @__PURE__ */ uiIcon(VendorIconWebhook, 'Webhook')
export const Wifi = /* @__PURE__ */ uiIcon(VendorIconWifi, 'Wifi')
export const WifiOff = /* @__PURE__ */ uiIcon(VendorIconWifiOff, 'WifiOff')
export const Window = /* @__PURE__ */ uiIcon(VendorIconAppWindow, 'Window')
export const WindowRestore = /* @__PURE__ */ uiIcon(VendorIconWindowMaximize, 'WindowRestore')
export const Wrench = /* @__PURE__ */ uiIcon(VendorIconTool, 'Wrench')
export const X = /* @__PURE__ */ uiIcon(VendorIconX, 'X')
export const XIcon = /* @__PURE__ */ uiIcon(VendorIconX, 'XIcon')
export const Zap = /* @__PURE__ */ uiIcon(VendorIconBolt, 'Zap')
export const ZapFilled = /* @__PURE__ */ uiIcon(VendorIconBoltFilled, 'ZapFilled')
export const ZoomIn = /* @__PURE__ */ uiIcon(VendorIconZoomIn, 'ZoomIn')
export const ZoomOut = /* @__PURE__ */ uiIcon(VendorIconZoomOut, 'ZoomOut')

export const iconSize = { xs: 'size-3', sm: 'size-3.5', md: 'size-4', lg: 'size-5', xl: 'size-6' } as const
export type IconSize = keyof typeof iconSize
