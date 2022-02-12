export type DRMedia = {
  id: string
  channel: {
    id: string
    colors: {
      primary: string
      secondary: string
    }
    districtName: string
    title: string
    parentChannelId: string
    priority: number
    isLive: boolean
    hasEpg: boolean
    isDistrictChannel: boolean
    hasDistrictChannels: boolean
    illustration: [
      {
        imageInfo: {
          id: string
          cropInfo: {
            x: number
            y: number
            width: number
            height: number
          }
        }
        imageWidthCropInfo: string
        webImages: [
          {
            imageUrl: string
            pixelWidth: number
          },
        ]
        isDefaultImage: boolean
      },
    ]
    imagesWithRatio: [
      {
        ratio: string
        url: string
        width: number
      },
    ]
    mediaAssetsLive: {
      flashUrl: string
      hlsUrl: string
      hlsMobileUrl: string
      mp3Url: string
      bufferDuration: string
    }
  }
  date: string
  title: string
  entries: [
    {
      learnId: string
      onDemandUsageRights: {
        isGeoBlocked: boolean
        availableFrom: string
        availableTo: string
        hasRightsNow: boolean
      }
      title: string
      description: string
      programId: string
      seriesId: string
      seriesTitle: string
      plannedStart: string
      actualStart: string
      duration: string
      relativeTimeType: number
      image: {
        imageInfo: {
          id: string
          cropInfo: {
            x: number
            y: number
            width: number
            height: number
          }
        }
        imageWidthCropInfo: string
        webImages: [
          {
            imageUrl: string
            pixelWidth: number
          },
        ]
        isDefaultImage: boolean
      }
      imagesWithRatio: [
        {
          ratio: string
          url: string
          width: number
        },
      ]
      isTranscoded: boolean
      reRun: boolean
      programUrlMetadata: string
      sourceMedium: number
      reviewUrl: string
      type: string
    },
  ]
}
