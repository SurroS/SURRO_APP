import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { FlatList, Image, Modal, TouchableOpacity } from 'react-native'
import { Text, View, XStack } from 'tamagui'

export default function GalleryScreen() {
  const [images, setImages] = useState<string[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri])
    }
  }

  // Confirm delete
  const confirmDelete = () => {
    if (selectedImage) {
      setImages(images.filter((img) => img !== selectedImage))
      setSelectedImage(null)
      setShowDeleteConfirm(false)
      setDeleteMode(false) // exit delete mode
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000) // auto close
    }
  }

  // Dismiss modal
  const dismissDelete = () => {
    setShowDeleteConfirm(false)
  }

  // Render grid item
  const renderGridItem = ({ item }) => {
    const itemStyle = {
      width: '50%',
      aspectRatio: 3 / 4,
      padding: 4,
    }

    if (item === 'add') {
      return (
        <TouchableOpacity
          style={{
            ...itemStyle,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
          }}
          onPress={pickImage}
        >
          <Ionicons name="add-circle" size={32} color="#0E0E55" />
          <Text fontSize={14} marginTop={4}>
            Add image
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={{ ...itemStyle, borderRadius: 8, overflow: 'hidden' }}
          onLongPress={() => {
            setDeleteMode(true)
            setSelectedImage(item)
          }}
        >
          <Image
            source={{ uri: item }}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
          />
        </TouchableOpacity>
      )
    }
  }

  return (
    <View flex={1} backgroundColor="#fff">
      {/* Header */}
      <View paddingHorizontal={16} paddingTop={40} backgroundColor="#fff">
        <XStack
          alignItems="center"
          marginBottom={20}
          width="100%"
          justifyContent="space-between"
        >
          <TouchableOpacity
            style={{ width: 40, height: 24, justifyContent: 'center' }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text fontSize={18} fontWeight="600" flex={1} textAlign="center">
            Gallery
          </Text>
          <View style={{ width: 40 }} />
        </XStack>
      </View>

      {/* Content */}
      <View flex={1} paddingHorizontal={16}>
        {deleteMode ? (
          <BlurView intensity={10} tint="light" style={{ flex: 1 }}>
            <FlatList
              data={[...images, 'add']}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={renderGridItem}
            />
          </BlurView>
        ) : (
          <FlatList
            data={[...images, 'add']}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={renderGridItem}
          />
        )}
      </View>

      {/* Bottom Delete Bar */}
      {deleteMode && selectedImage && !showDeleteConfirm && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: '#fff',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <Ionicons
            name="trash"
            size={18}
            color="black"
            style={{ marginRight: 8 }}
          />
          <Text fontSize={16} fontWeight="500">
            Delete image
          </Text>
        </TouchableOpacity>
      )}

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <BlurView
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          intensity={40}
          tint="dark"
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 24,
              paddingTop: 10,
              alignItems: 'center',
              width: '100%',
              paddingBottom: 30,
            }}
          >
            <Image
              source={require('@/assets/images/delete.png')}
              style={{ width: 120, height: 120, marginTop: 0, marginBottom: 0 }}
              resizeMode="contain"
            />

            <Text fontSize={16} marginVertical={12} textAlign="center">
              Confirm that you want to delete this image
            </Text>

            <XStack gap={12} width="100%">
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F1F1F1',
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={dismissDelete}
              >
                <Text color="black">Dismiss</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#BB2D21',
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={confirmDelete}
              >
                <Text color="white">Delete</Text>
              </TouchableOpacity>
            </XStack>
          </View>
        </BlurView>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <BlurView
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          intensity={40}
          tint="dark"
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              alignItems: 'center',
              width: '100%',
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#00724A',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
            <Text fontSize={16} textAlign="center">
              Image successfully deleted
            </Text>
          </View>
        </BlurView>
      </Modal>
    </View>
  )
}
