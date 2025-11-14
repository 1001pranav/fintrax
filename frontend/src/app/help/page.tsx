'use client';

import { useState } from 'react';
import { Search, Book, Target, Wallet, Map, Settings, KeyboardMusic, ChevronRight } from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  articles: {
    title: string;
    content: string;
  }[];
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    description: 'Learn the basics of Fintrax',
    articles: [
      {
        title: 'Welcome to Fintrax',
        content: `Fintrax is your all-in-one platform for managing tasks, projects, and finances. This guide will help you get started quickly.

**What is Fintrax?**
Fintrax combines productivity management with financial tracking in a single, intuitive platform. Instead of juggling multiple apps, you can manage your projects, tasks, savings, expenses, and learning roadmaps all in one place.

**Key Features:**
- Project and task management with kanban boards
- Financial tracking (income, expenses, savings, loans)
- Learning roadmaps for skill development
- Integrated dashboard with insights
- Data export and backup

**Getting Started:**
1. Create your first project from the Projects page
2. Add tasks to break down your project
3. Record your first transaction in the Finance section
4. Set up a savings goal to track your progress
5. Explore the dashboard for insights`,
      },
      {
        title: 'Creating Your First Project',
        content: `Projects help you organize related tasks and track progress toward specific goals.

**To create a project:**
1. Navigate to the Projects page from the sidebar
2. Click the "New Project" button
3. Enter a project name (e.g., "Website Redesign", "Learn React")
4. Choose a color to visually identify your project
5. Add a description (optional)
6. Click "Create Project"

**Tips:**
- Use descriptive project names
- Assign colors that make sense to you (e.g., blue for work, green for personal)
- Keep project scope manageable
- Use projects to group related tasks together`,
      },
      {
        title: 'Adding and Managing Tasks',
        content: `Tasks are the building blocks of your projects. They represent specific actions you need to complete.

**To create a task:**
1. Open a project or navigate to the Tasks view
2. Click "Add Task" or the "+" button
3. Enter a task title (be specific and actionable)
4. Set priority (Low, Medium, High)
5. Choose a status (To Do, In Progress, Done)
6. Add start and end dates (optional)
7. Attach tags for categorization
8. Click "Save"

**Task Organization:**
- Use the kanban board to visualize workflow
- Drag and drop tasks between status columns
- Filter tasks by priority, status, or tags
- Set due dates to track deadlines
- Add notes and resources to tasks for context

**Best Practices:**
- Break large tasks into smaller subtasks
- Use clear, action-oriented titles ("Write blog post" not "Blog")
- Set realistic deadlines
- Update task status regularly`,
      },
    ],
  },
  {
    id: 'projects-tasks',
    title: 'Projects & Tasks',
    icon: Target,
    description: 'Manage your projects and tasks efficiently',
    articles: [
      {
        title: 'Using the Kanban Board',
        content: `The kanban board provides a visual way to manage your workflow and see task progress at a glance.

**Board Structure:**
- **To Do**: Tasks that haven't been started
- **In Progress**: Tasks currently being worked on
- **Done**: Completed tasks

**Using the Board:**
1. Drag tasks between columns to update their status
2. Click on a task card to view or edit details
3. Use the filter options to focus on specific priorities or tags
4. View task counts in each column

**Tips:**
- Limit "In Progress" tasks to maintain focus (3-5 is ideal)
- Regularly move completed tasks to "Done"
- Use the board view for daily planning
- Switch to calendar view for deadline-focused planning`,
      },
      {
        title: 'Task Priorities and Tags',
        content: `Prioritize and categorize your tasks for better organization.

**Priorities:**
- **High**: Urgent tasks requiring immediate attention
- **Medium**: Important tasks to complete soon
- **Low**: Tasks that can wait

**Tags:**
Tags help you categorize tasks across projects. Common tag examples:
- @quick (tasks under 15 minutes)
- @important
- @research
- @review
- #client-name
- #bug-fix

**Creating Tags:**
1. Click "Manage Tags" in the task view
2. Add a new tag with a name and color
3. Assign tags when creating or editing tasks
4. Filter tasks by tags to see related items

**Best Practices:**
- Use priority for urgency, tags for categorization
- Create a consistent tagging system
- Don't over-tag - 2-3 tags per task is usually enough
- Review and remove unused tags periodically`,
      },
      {
        title: 'Task Resources and Notes',
        content: `Attach important information to your tasks with resources and notes.

**Adding Resources:**
Resources can be:
- **Links**: URLs to relevant websites, documents, or tools
- **Notes**: Text notes with context or instructions
- **Videos**: Links to tutorial videos or recordings
- **Audio**: Links to audio files or podcasts

**How to Add Resources:**
1. Open a task
2. Click "Add Resource"
3. Select the resource type
4. Enter the URL or content
5. Add a title/description
6. Save

**Notes:**
Use notes for:
- Progress updates
- Ideas and brainstorming
- Meeting notes related to the task
- Problems encountered and solutions
- Next steps

**Tips:**
- Keep resources organized and relevant
- Delete outdated resources
- Use descriptive titles for easy reference
- Consider using links to shared documents for collaboration`,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance Management',
    icon: Wallet,
    description: 'Track your income, expenses, and financial goals',
    articles: [
      {
        title: 'Recording Transactions',
        content: `Track your income and expenses to understand your cash flow.

**Types of Transactions:**
- **Income**: Money received (salary, freelance, investments)
- **Expense**: Money spent (bills, groceries, entertainment)

**Recording a Transaction:**
1. Go to the Finance page
2. Click "Add Transaction"
3. Select type (Income or Expense)
4. Enter the source/description (e.g., "Salary", "Grocery Shopping")
5. Enter the amount
6. Select a category
7. Choose the date
8. Add notes (optional)
9. Click "Save"

**Categories:**
**Income Categories:**
- Salary
- Freelance
- Investment Returns
- Other

**Expense Categories:**
- Food & Dining
- Transportation
- Utilities & Bills
- Entertainment
- Shopping
- Healthcare
- Other

**Tips:**
- Record transactions as soon as possible
- Be specific in descriptions
- Use consistent categorization
- Review transactions weekly`,
      },
      {
        title: 'Managing Savings Goals',
        content: `Set and track financial goals to build better saving habits.

**Creating a Savings Goal:**
1. Navigate to the Finance page
2. Click "Add Saving" in the Savings section
3. Enter a name (e.g., "Emergency Fund", "Vacation")
4. Set the current amount saved
5. Add an interest rate if applicable
6. Click "Save"

**Tracking Progress:**
- View your savings on the Finance dashboard
- See progress bars showing how close you are to goals
- Update amounts as you add to your savings
- Track interest earned on savings accounts

**Savings Strategies:**
- Start with an emergency fund (3-6 months expenses)
- Set specific, measurable goals
- Use automatic transfers if possible
- Celebrate milestones
- Review and adjust goals quarterly

**Tips:**
- Break large goals into smaller milestones
- Set realistic timeframes
- Consider high-yield savings accounts
- Track multiple goals separately`,
      },
      {
        title: 'Loan and Debt Tracking',
        content: `Manage your loans and debts to plan your repayment strategy.

**Adding a Loan:**
1. Go to the Finance page
2. Click "Add Loan" in the Loans section
3. Enter loan name (e.g., "Student Loan", "Car Loan")
4. Enter total loan amount
5. Set interest rate
6. Choose payment term (monthly, quarterly)
7. Enter duration (total loan period)
8. Set premium amount (payment per term)
9. Click "Save"

**Understanding Loan Details:**
- **Total Amount**: Original loan principal
- **Interest Rate**: Annual interest rate (%)
- **Term**: Payment frequency (monthly, quarterly, etc.)
- **Duration**: Total loan period
- **Premium**: Payment amount per term

**Viewing Loan Information:**
- See all active loans on your finance dashboard
- Track remaining balance
- View payment schedules
- Calculate interest paid

**Debt Management Tips:**
- List all debts with interest rates
- Consider the avalanche method (pay high interest first)
- Or the snowball method (pay smallest balance first)
- Make minimum payments on all debts
- Put extra money toward target debt
- Track progress to stay motivated`,
      },
      {
        title: 'Financial Analytics and Insights',
        content: `Understand your spending patterns and financial health through analytics.

**Dashboard Metrics:**
- **Current Balance**: Your available funds
- **Net Worth**: Total assets minus total debts
- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expense transactions
- **Savings**: Total amount in savings goals
- **Debts**: Total outstanding loan amounts

**Charts and Visualizations:**
1. **Expense Breakdown**: Pie chart showing spending by category
2. **Income vs Expense Trend**: Line chart tracking financial flow over time
3. **Net Worth Over Time**: Area chart showing wealth growth
4. **Category Spending**: Bar chart comparing expense categories

**Using Insights:**
- Identify overspending categories
- Track income stability
- Monitor debt reduction progress
- Set budget limits based on patterns
- Adjust spending habits
- Plan for irregular expenses

**Reports:**
- Export transaction data for tax preparation
- Generate spending reports by date range
- Analyze trends month-over-month
- Compare current vs previous periods`,
      },
    ],
  },
  {
    id: 'roadmaps',
    title: 'Roadmaps',
    icon: Map,
    description: 'Plan and visualize your learning journey',
    articles: [
      {
        title: 'Creating Learning Roadmaps',
        content: `Roadmaps help you plan long-term goals and visualize progress over time.

**What are Roadmaps?**
Roadmaps are timeline-based plans that help you:
- Structure learning paths
- Plan project phases
- Track milestone completion
- Visualize dependencies
- Manage long-term goals

**Creating a Roadmap:**
1. Go to the Roadmaps page
2. Click "New Roadmap"
3. Enter a name (e.g., "Learn Full-Stack Development")
4. Set start and end dates
5. Add a description
6. Set initial progress (0-100%)
7. Click "Create"

**Roadmap Use Cases:**
- Learning new skills (programming, languages, etc.)
- Career development paths
- Project phases and milestones
- Personal development goals
- Business growth planning

**Tips:**
- Start with clear end goals
- Break roadmaps into phases
- Set realistic timeframes
- Review and adjust regularly
- Celebrate milestone completions`,
      },
      {
        title: 'Timeline Visualization',
        content: `Use the timeline view to see your roadmap tasks and milestones visually.

**Timeline Features:**
- **Task Bars**: Visual representation of task duration
- **Milestones**: Important checkpoints in your journey
- **Dependencies**: See which tasks depend on others
- **Zoom Levels**: Day, week, or month views
- **Drag to Reschedule**: Move tasks to adjust dates

**Using the Timeline:**
1. Open a roadmap
2. Switch to "Timeline" view
3. Add tasks to the roadmap
4. Set start and end dates for each task
5. Drag task bars to reschedule
6. Add milestones for important deadlines

**Timeline Best Practices:**
- Keep task duration realistic
- Add buffer time between tasks
- Mark dependencies clearly
- Use milestones for major achievements
- Review timeline weekly
- Adjust as circumstances change

**Tips:**
- Color-code related tasks
- Set milestone rewards
- Track velocity (tasks completed per week)
- Share progress with accountability partners`,
      },
    ],
  },
  {
    id: 'settings-data',
    title: 'Settings & Data',
    icon: Settings,
    description: 'Manage your account and data',
    articles: [
      {
        title: 'Exporting Your Data',
        content: `Create backups of your data or export for analysis.

**Export Formats:**
1. **Complete Backup (JSON)**: All your data in one file
2. **Individual CSV Files**: Separate files for projects, tasks, transactions, etc.

**How to Export:**
1. Go to Settings → Data Management
2. Choose export format:
   - Click "Complete Backup" for JSON export
   - Or click individual data type for CSV export
3. File will download automatically
4. Store backup in a safe location

**What's Included:**
- All projects and their details
- All tasks with status, priority, and dates
- All financial transactions
- Savings goals and loan information
- Roadmaps and associated tasks
- Tags and categories

**When to Export:**
- Before making major changes
- Monthly for regular backups
- Before account closure
- For external analysis in Excel/Google Sheets
- For tax preparation (transaction history)

**Tips:**
- Export data monthly as a backup
- Store exports in cloud storage (Google Drive, Dropbox)
- Use CSV exports for spreadsheet analysis
- Keep exports for at least 1 year`,
      },
      {
        title: 'Importing Data',
        content: `Restore data from a previous backup.

**Import Process:**
1. Go to Settings → Data Management
2. Click "Choose Backup File" in the Import section
3. Select your JSON backup file
4. Wait for validation
5. Review import summary
6. Confirm import

**Important Notes:**
- Only JSON backup files can be imported
- CSV imports are not currently supported
- Importing adds to existing data (doesn't replace)
- Duplicate entries may be created
- **Always export a backup before importing**

**What Happens During Import:**
- File is validated for correct format
- Data is checked for consistency
- Valid items are imported
- Invalid items are reported
- Import summary is displayed

**Troubleshooting:**
If import fails:
- Verify file is a valid JSON backup
- Check file isn't corrupted
- Ensure file was exported from Fintrax
- Try exporting and importing a smaller dataset first

**Best Practices:**
- Test import with a small backup first
- Keep original export files
- Review imported data after import
- Export a new backup after successful import`,
      },
      {
        title: 'Account Security',
        content: `Keep your Fintrax account secure.

**Password Requirements:**
- At least 8 characters long
- Include uppercase and lowercase letters
- Include at least one number
- Special characters recommended

**Security Best Practices:**
1. **Use a Strong Password**
   - Don't reuse passwords from other sites
   - Consider using a password manager
   - Change password every 3-6 months

2. **Enable Two-Factor Authentication (Coming Soon)**
   - Adds extra layer of security
   - Requires code from your phone to log in

3. **Review Active Sessions**
   - Check for unfamiliar devices
   - Log out of unused sessions
   - Use "Log out everywhere" if concerned

4. **Be Cautious with Links**
   - Don't click suspicious email links
   - Verify URLs before entering credentials
   - Fintrax will never ask for password via email

5. **Regular Data Backups**
   - Export data monthly
   - Store backups securely
   - Keep multiple backup copies

**Reporting Security Issues:**
If you notice suspicious activity:
- Change your password immediately
- Review recent account activity
- Contact support if needed
- Report the issue using the feedback form`,
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: KeyboardMusic,
    description: 'Work faster with keyboard shortcuts',
    articles: [
      {
        title: 'Available Shortcuts',
        content: `Speed up your workflow with these keyboard shortcuts (Coming Soon):

**Global Shortcuts:**
- \`Ctrl/Cmd + K\`: Open global search
- \`Ctrl/Cmd + N\`: Create new item (context-dependent)
- \`Ctrl/Cmd + /\`: Open keyboard shortcuts help
- \`Esc\`: Close modals and dialogs

**Navigation:**
- \`G then D\`: Go to Dashboard
- \`G then P\`: Go to Projects
- \`G then F\`: Go to Finance
- \`G then R\`: Go to Roadmaps
- \`G then S\`: Go to Settings

**Task Management:**
- \`N\`: New task (in task view)
- \`E\`: Edit selected task
- \`Delete\`: Delete selected task
- \`Ctrl/Cmd + Enter\`: Mark task as done
- \`1\`: Set priority to High
- \`2\`: Set priority to Medium
- \`3\`: Set priority to Low

**Finance:**
- \`T\`: Add new transaction (in finance view)
- \`I\`: Quick add income
- \`E\`: Quick add expense

**Modal/Form Actions:**
- \`Enter\`: Submit form/modal
- \`Esc\`: Cancel and close
- \`Tab\`: Move to next field
- \`Shift + Tab\`: Move to previous field

**Tips:**
- Shortcuts are context-aware
- Some shortcuts only work in specific views
- Combination shortcuts use letter keys (like Gmail)
- Practice shortcuts to build muscle memory`,
      },
    ],
  },
];

export default function HelpPage() {
  const [selectedSection, setSelectedSection] = useState<string>('getting-started');
  const [selectedArticle, setSelectedArticle] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSection = helpSections.find((s) => s.id === selectedSection) || helpSections[0];
  const currentArticle = currentSection.articles[selectedArticle];

  // Filter sections based on search
  const filteredSections = searchQuery
    ? helpSections.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.articles.some(
            (article) =>
              article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              article.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : helpSections;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Help & Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Learn how to use Fintrax to manage your projects and finances
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Sections */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <nav className="space-y-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setSelectedSection(section.id);
                        setSelectedArticle(0);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Article List */}
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{currentSection.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{currentSection.description}</p>
                  <nav className="space-y-2">
                    {currentSection.articles.map((article, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedArticle(index)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedArticle === index
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-sm">{article.title}</span>
                        <ChevronRight size={16} className="flex-shrink-0" />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Article Content */}
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{currentArticle.title}</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {currentArticle.content.split('\n\n').map((paragraph, index) => {
                      // Check if paragraph is a heading
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        const text = paragraph.slice(2, -2);
                        return (
                          <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                            {text}
                          </h3>
                        );
                      }

                      // Check if paragraph is a list
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').filter((item) => item.trim());
                        return (
                          <ul key={index} className="list-disc list-inside space-y-2 mb-4">
                            {items.map((item, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">
                                {item.replace(/^- /, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      // Check if paragraph is a numbered list
                      if (/^\d+\./.test(paragraph)) {
                        const items = paragraph.split('\n').filter((item) => item.trim());
                        return (
                          <ol key={index} className="list-decimal list-inside space-y-2 mb-4">
                            {items.map((item, i) => (
                              <li key={i} className="text-gray-700 dark:text-gray-300">
                                {item.replace(/^\d+\.\s/, '')}
                              </li>
                            ))}
                          </ol>
                        );
                      }

                      // Regular paragraph
                      return (
                        <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      {selectedArticle > 0 && (
                        <button
                          onClick={() => setSelectedArticle(selectedArticle - 1)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          ← Previous: {currentSection.articles[selectedArticle - 1].title}
                        </button>
                      )}
                    </div>
                    <div>
                      {selectedArticle < currentSection.articles.length - 1 && (
                        <button
                          onClick={() => setSelectedArticle(selectedArticle + 1)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Next: {currentSection.articles[selectedArticle + 1].title} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
