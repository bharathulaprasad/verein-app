This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## To generate prisma
npx prisma generate
## To Seed prisma
npx prisma db seed
## To pull prisma
npx prisma db pull

## To push prisma
npx prisma db pull

## How to add Schema incrementally
When the db is already in production, but now if you like to add a new Schema table, then use command
npx prisma migrate dev 
example: npx prisma migrate dev  --name add_page_stats_table
Then this will not clean up any db tables rathen compares.
Prisma compares your schema to your local database, sees that only PageStat is new, and creates a .sql migration file that literally just says CREATE TABLE "PageStat".... It does not overwrite your existing data.

## Afterwards incremental deploy the migrated 
npx prisma migrate deploy

## How to baseline a database so that future the database is never recreated 
Steps: 
1. Don't add new table. At the step where the current db is currently is in the same state create a baseline.
For this create a folder for example prisma/migrations/0_init
2. Run command npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
3. Add Schema changes like adding new table like PageStat table in to schema.prisma and run command
npx prisma migrate dev --name add_visitor_counter
4. finally run npx prisma migrate deploy
5. and to see the table created run this command 
npx prisma db push

## Step by Step instructions after buying a domain, adding your purchased domain to Vercel. to host the same website.
Step 1: Add the Domain to Vercel
Go to your Vercel Dashboard and click on your project.
Click on the Settings tab at the top.
On the left sidebar, click on Domains.
Type in your new domain (e.g., yourdomain.com) and click Add.
Vercel will usually ask if you want to add the www version as well and redirect it. It is highly recommended to click Add for both (so yourdomain.com and www.yourdomain.com both work).
Step 2: Connect your Domain (DNS Settings)
Once you add the domain, Vercel will show an "Invalid Configuration" error. This is normal! It just means your domain provider (where you bought the domain, like GoDaddy, Namecheap, or Hostinger) doesn't know about Vercel yet.

Vercel will show you exactly what DNS Records you need to add. You have two ways to do this:

Method A: Using A-Records & CNAME (Recommended & Safest)
Log in to the website where you bought your domain, find the DNS Management or DNS Settings page, and add these two records:

For the root domain (yourdomain.com):
Type: A
Name/Host: @ (or leave blank depending on provider)
Value/Points to: 76.76.21.21 (Vercel's IP address)
For the www subdomain (www.yourdomain.com):
Type: CNAME
Name/Host: www
Value/Points to: cname.vercel-dns.com
Method B: Using Nameservers (Easier)
Alternatively, Vercel might give you two Nameservers (e.g., ns1.vercel-dns.com and ns2.vercel-dns.com). You can go to your domain provider, find "Nameservers", switch them to "Custom", and paste Vercel's nameservers there. (Note: If you have custom email like info@yourdomain.com already set up, use Method A instead so you don't break your email).

Step 3: Wait a few minutes
Once you save the settings at your domain provider, go back to Vercel. Within 5 to 15 minutes, the red errors will turn into Green Checkmarks, and your website will be live on your new domain!

Because your app uses NextAuth (Auth.js) and a database for logins and admin roles, changing your domain will break your login system until you update two things:

1. Update Vercel Environment Variables:
Go to Vercel > Settings > Environment Variables. Find NEXTAUTH_URL and change it from the old .vercel.app URL to your new custom domain:

Key: NEXTAUTH_URL
Value: https://www.yourdomain.com (Make sure it starts with https://)
2. Update your OAuth Providers (Google, GitHub, etc.):
If your users log in with Google, GitHub, or another provider, those providers will block the new domain for security reasons until you whitelist it.

Go to your Google Cloud Console (or GitHub developer settings).
Find your OAuth app credentials.
Add your new domain to the Authorized JavaScript origins: https://www.yourdomain.com
Add your new domain to the Authorized redirect URIs: https://www.yourdomain.com/api/auth/callback/google (replace google with your specific provider).
After you do this, go to Vercel and Redeploy your app one last time so it picks up the new NEXTAUTH_URL. Your admin panel and custom domain will work perfectly!