import { Layout } from "@/components/layout/Layout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateInquiry } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MapPin, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

const inquirySchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more details in your message"),
})

export default function Contact() {
  const createInquiry = useCreateInquiry()

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  const onSubmit = (data: z.infer<typeof inquirySchema>) => {
    createInquiry.mutate({ data }, {
      onSuccess: () => {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible."
        })
        form.reset()
      }
    })
  }

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question about our safaris or want to start planning a custom journey? We're here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Contact Information</h2>
            <div className="space-y-6 text-muted-foreground">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Nairobi Office</h4>
                  <p>123 Safari Way, Westlands<br/>Nairobi, Kenya</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p>+254 700 000 000<br/>+1 (800) 123 4567 (US Toll Free)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p>hello@twigatravels.example.com<br/>bookings@twigatravels.example.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-muted rounded-xl">
              <h3 className="font-serif font-bold mb-2">Office Hours</h3>
              <p className="text-sm text-muted-foreground mb-1">Monday - Friday: 8:00 AM - 6:00 PM EAT</p>
              <p className="text-sm text-muted-foreground">Saturday: 9:00 AM - 1:00 PM EAT</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Send a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" className="h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={createInquiry.isPending}>
                  {createInquiry.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </Layout>
  )
}
