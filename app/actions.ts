'use server'

import ytdl from 'ytdl-core';
import fs from 'fs'

export async function fetchInfo(prevState: any, formData: FormData) {
  const id = formData.get('ytid') as string
  const info = await ytdl.getInfo(id);
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
  return { id, format }
}
