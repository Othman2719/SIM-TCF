# TCF Test Simulator - Multi-User Desktop Application

## 🌟 Features
A comprehensive Test de Connaissance du Français (TCF) simulator designed for language centers, featuring real-time multi-user functionality and desktop deployment.
### For Language Centers
- **Multi-User System**: Real-time synchronization across all devices
- **Admin Panel**: Create and manage tests that appear instantly for all users
- **User Management**: Role-based access (Super Admin, Admin, Client)
- **Real-time Updates**: When admins create tests, they appear immediately on all connected devices
- **Desktop Application**: Standalone app for Windows, macOS, and Linux
### For Students
- **Complete TCF Simulation**: Listening, Grammar, and Reading comprehension
- **Timed Tests**: 90-minute official test duration with automatic submission
- **Instant Results**: Detailed scoring with TCF level assessment (A1-C2)
- **Certificate Generation**: Printable certificates with unique numbers
- **Progress Tracking**: Section-by-section progress monitoring
## 🚀 Quick Start
### Prerequisites
- Node.js 18+ installed
- Supabase account and project set up
### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd tcf-simulator
# Install dependencies
npm install
# Configure Supabase (see Setup Guide below)
# Add your Supabase credentials to .env file
```
### Supabase Setup Guide

1. **Create Supabase Account**:
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up and create a new project named `tcf-simulator`

2. **Get Your Credentials**:
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and Anon Key

3. **Set Up Database**:
   - Go to SQL Editor in Supabase
   - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`
   - Then run `supabase/migrations/002_sample_data.sql`

4. **Configure Environment**:
   - Edit `.env` file with your actual Supabase credentials
   - Replace the placeholder values with your real Project URL and Anon Key

5. **Enable Realtime**:
   - Go to Database → Replication in Supabase
   - Enable realtime for tables: `exam_sets`, `questions`, `users`

### Development
```bash
# Run web version
npm run dev
# Run desktop version
npm run electron-dev
```
### Production Build
```bash
# Build desktop installers
npm run dist          # All platforms
npm run dist-win      # Windows .exe
npm run dist-mac      # macOS .dmg
npm run dist-linux    # Linux .AppImage
```
## 🏢 For Language Centers
### Setting Up Multi-User System
1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Configure Environment**: Add your Supabase URL and keys to `.env`
3. **Database Setup**: The database schema is already defined - just connect
4. **Deploy**: Build desktop apps for your center's computers
### Admin Features
- **Real-time Test Creation**: Create tests that appear instantly on all student devices
- **User Management**: Add/remove students and staff
- **Content Management**: Add questions with audio, images, and multiple difficulty levels
- **Analytics**: Track student progress and results
### Commercial Benefits
- **Scalable**: Supports unlimited concurrent users
- **Professional**: Native desktop application with certificates
- **Efficient**: No internet required after initial setup
- **Customizable**: Easy to brand and customize for your center
## 🛠️ Technical Architecture
### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Electron** for desktop deployment
- **Vite** for fast development
### Backend
- **Supabase** for database and real-time features
- **PostgreSQL** database with Row Level Security
- **Real-time subscriptions** for instant updates
- **JWT authentication** for secure access
### Key Technologies
- **Real-time Sync**: Supabase Realtime for instant updates
- **Audio Support**: Native HTML5 audio with playback controls
- **PDF Generation**: Certificate creation and printing
- **Cross-platform**: Electron for Windows, macOS, Linux
## 📊 Database Schema
The application uses a comprehensive database schema with:
- **Users**: Authentication and role management
- **Exam Sets**: Test collections with metadata
- **Questions**: Multi-media questions with audio/images
- **Test Sessions**: User progress tracking
- **Results**: Detailed scoring and certificates
- **Analytics**: Usage tracking and reporting
## 🔒 Security Features
- **Row Level Security**: Database-level access control
- **Role-based Access**: Super Admin, Admin, and Client roles
- **Secure Authentication**: Supabase Auth with JWT tokens
- **Data Validation**: Input sanitization and validation
- **Audit Logging**: Track all administrative actions
## 📱 Multi-Device Support
- **Desktop Apps**: Native Windows, macOS, Linux applications
- **Web Version**: Browser-based access for any device
- **Real-time Sync**: Changes appear instantly across all devices
- **Offline Capable**: Continue tests even if connection drops
## 🎯 Perfect for Language Centers
This application is specifically designed for language centers that need:
- Professional TCF test simulation
- Multi-user management
- Real-time content updates
- Desktop deployment
- Certificate generation
- Progress tracking
- Commercial licensing
## 📞 Support
For commercial licensing, customization, or support:
- Email: [your-email@domain.com]
- Website: [your-website.com]
- Documentation: [docs-url]
## 📄 License
Commercial license available for language centers and educational institutions.