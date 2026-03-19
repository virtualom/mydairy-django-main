from js import Response, fetch

async def on_fetch(request, env):
    # This worker simply proxies all requests to your Render app.
    # It ensures the 'Workers Build' check passes on GitHub.
    url = str(request.url)
    render_url = env.RENDER_URL
    
    # Replace the hostname with your Render hostname
    new_url = url.replace(request.headers.get("host"), render_url.split("//")[1])
    
    # Optional: You can also just return a Redirect if proxying is too complex
    # return Response.redirect(render_url + request.path_with_query, 301)
    
    return await fetch(new_url, request)
